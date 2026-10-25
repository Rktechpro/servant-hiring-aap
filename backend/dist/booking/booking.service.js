"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeBooking = exports.cancelBooking = exports.rejectBooking = exports.acceptBooking = exports.getBookingRequests = exports.getMyBookings = exports.createBooking = void 0;
const servant_model_1 = require("../servant/servant.model");
const customer_model_1 = require("../customer/customer.model");
const Booking_Socket_1 = require("../socket/Booking.Socket");
const booking_enum_1 = require("./booking.enum");
const booking_model_1 = require("./booking.model");
const mongoose_1 = require("mongoose");
const auth_model_1 = require("../auth/auth.model");
const createBooking = async (customerId, data) => {
    const servant = await servant_model_1.Servant.findOne({ _id: data.servantId, isActive: true });
    if (!servant)
        throw new Error("Servant not found");
    if (!servant.availability)
        throw new Error("Servant is currently unavailable");
    const hourlyPrice = servant.hourlyPrice;
    const totalAmount = data.hours * hourlyPrice;
    const booking = await booking_model_1.Booking.create({
        customerId,
        servantId: servant._id,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        hours: data.hours,
        hourlyPrice,
        totalAmount,
        location: servant.servantlocation,
        address: servant.servantAddress,
        status: booking_enum_1.bookingStatus.PENDING,
    });
    // Notify servant after the booking is saved
    (0, Booking_Socket_1.getIO)()
        .to(`user:${String(servant.userId)}`)
        .emit("booking:new", {
        booking: booking.toObject(),
    });
    return booking;
};
exports.createBooking = createBooking;
const getMyBookings = async (userId, role) => {
    let match;
    if (role === "CUSTOMER") {
        match = { customerId: new mongoose_1.Types.ObjectId(userId) };
    }
    else if (role === "SERVANT") {
        const servant = await servant_model_1.Servant.findOne({
            userId: new mongoose_1.Types.ObjectId(userId),
        });
        if (!servant) {
            throw new Error("Servant not found");
        }
        match = { servantId: servant._id };
    }
    else {
        throw new Error("Invalid role");
    }
    return booking_model_1.Booking.aggregate([
        { $match: match },
        // Customer fullname and mobile
        {
            $lookup: {
                from: customer_model_1.Customer.collection.name,
                let: { bookingCustomerId: "$customerId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$_id", "$$bookingCustomerId"] },
                                    { $eq: ["$userId", "$$bookingCustomerId"] },
                                ],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: auth_model_1.authModel.collection.name,
                            localField: "userId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            fullname: "$user.fullname",
                            email: "$user.email",
                            mobile: "$user.mobile",
                        },
                    },
                ],
                as: "customer",
            },
        },
        {
            $unwind: {
                path: "$customer",
                preserveNullAndEmptyArrays: true,
            },
        },
        // Servant profile data
        {
            $lookup: {
                from: servant_model_1.Servant.collection.name,
                localField: "servantId",
                foreignField: "_id",
                as: "servant",
            },
        },
        {
            $unwind: {
                path: "$servant",
                preserveNullAndEmptyArrays: true,
            },
        },
        // Servant fullname and mobile from auth collection
        {
            $lookup: {
                from: auth_model_1.authModel.collection.name,
                let: { servantUserId: "$servant.userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$servantUserId"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            fullname: 1,
                            email: 1,
                            mobile: 1,
                        },
                    },
                ],
                as: "servantUser",
            },
        },
        {
            $unwind: {
                path: "$servantUser",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                "servant.fullname": "$servantUser.fullname",
                "servant.email": "$servantUser.email",
                "servant.mobile": "$servantUser.mobile",
            },
        },
        {
            $project: {
                servantUser: 0,
            },
        },
        // Payment details
        {
            $lookup: {
                from: "payments",
                localField: "_id",
                foreignField: "bookingId",
                as: "payment",
            },
        },
        {
            $unwind: {
                path: "$payment",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                paymentStatus: {
                    $ifNull: ["$payment.status", "PENDING"],
                },
                paymentAmount: "$payment.amount",
            },
        },
        // Latest bookings first
        {
            $sort: { createdAt: -1 },
        },
    ]);
};
exports.getMyBookings = getMyBookings;
const getBookingRequests = async (servantUserId) => {
    // Logged-in User ID se Servant document find karo
    const servant = await servant_model_1.Servant.findOne({
        userId: servantUserId,
    });
    if (!servant) {
        throw new Error("Servant profile not found for this user");
    }
    // Booking mein Servant document ki _id use hoti hai
    return booking_model_1.Booking.find({
        servantId: servant._id,
        status: booking_enum_1.bookingStatus.PENDING,
    })
        .populate("customerId")
        .sort({ createdAt: -1 });
};
exports.getBookingRequests = getBookingRequests;
// Helper: notify the customer who created the booking
const notifyCustomer = async (customerId, bookingId, status) => {
    // Assumes Booking.customerId references a Customer document
    // and Customer.userId references the authenticated User.
    const customer = await customer_model_1.Customer.findById(customerId).select("userId");
    if (!customer?.userId) {
        console.error("Customer userId not found for booking:", bookingId);
        return;
    }
    const message = status === booking_enum_1.bookingStatus.ACCEPTED
        ? "Your booking has been accepted by the servant."
        : status === booking_enum_1.bookingStatus.REJECTED
            ? "Your booking has been rejected by the servant."
            : status === booking_enum_1.bookingStatus.CANCELLED
                ? "Your booking has been cancelled."
                : status === booking_enum_1.bookingStatus.COMPLETED
                    ? "Your booking has been completed."
                    : `Your booking status is ${status}.`;
    (0, Booking_Socket_1.getIO)()
        .to(`user:${String(customer.userId)}`)
        .emit("booking:status", {
        bookingId,
        status,
        message,
    });
};
// SERVANT - ACCEPT BOOKING
const acceptBooking = async (bookingId, servantUserId) => {
    const servant = await servant_model_1.Servant.findOne({
        userId: servantUserId,
    });
    if (!servant) {
        throw new Error("Servant profile not found");
    }
    const booking = await booking_model_1.Booking.findOneAndUpdate({
        _id: bookingId,
        servantId: servant._id,
        status: booking_enum_1.bookingStatus.PENDING,
    }, {
        $set: { status: booking_enum_1.bookingStatus.ACCEPTED },
    }, {
        returnDocument: "after",
        runValidators: true,
    });
    if (!booking) {
        throw new Error("Booking not found, already processed, or does not belong to this servant");
    }
    return booking;
};
exports.acceptBooking = acceptBooking;
// SERVANT - REJECT BOOKING
const rejectBooking = async (bookingId, servantUserId) => {
    const servant = await servant_model_1.Servant.findOne({
        userId: servantUserId,
    });
    if (!servant) {
        throw new Error("Servant profile not found");
    }
    const booking = await booking_model_1.Booking.findOneAndUpdate({
        _id: bookingId,
        servantId: servant._id,
        status: booking_enum_1.bookingStatus.PENDING,
    }, {
        $set: { status: booking_enum_1.bookingStatus.REJECTED },
    }, {
        returnDocument: "after",
        runValidators: true,
    });
    if (!booking) {
        throw new Error("Booking not found, already processed, or does not belong to this servant");
    }
    return booking;
};
exports.rejectBooking = rejectBooking;
// CUSTOMER - CANCEL BOOKING
const cancelBooking = async (bookingId, customerId) => {
    const booking = await booking_model_1.Booking.findOneAndUpdate({
        _id: bookingId,
        customerId,
        status: {
            $in: [
                booking_enum_1.bookingStatus.PENDING,
                booking_enum_1.bookingStatus.ACCEPTED,
            ],
        },
    }, {
        $set: {
            status: booking_enum_1.bookingStatus.CANCELLED,
        },
    }, {
        returnDocument: "after",
        runValidators: true,
    });
    if (!booking) {
        throw new Error("Booking not found or cannot be cancelled");
    }
    // Notify the servant about cancellation
    const servant = await servant_model_1.Servant.findById(booking.servantId)
        .select("userId");
    if (servant?.userId) {
        (0, Booking_Socket_1.getIO)()
            .to(`user:${String(servant.userId)}`)
            .emit("booking:status", {
            bookingId: String(booking._id),
            status: booking_enum_1.bookingStatus.CANCELLED,
            message: "The customer has cancelled this booking.",
        });
    }
    return booking;
};
exports.cancelBooking = cancelBooking;
// SERVANT - COMPLETE BOOKING
const completeBooking = async (bookingId, servantId) => {
    const booking = await booking_model_1.Booking.findOneAndUpdate({
        _id: bookingId,
        servantId,
        status: booking_enum_1.bookingStatus.ACCEPTED,
    }, {
        $set: {
            status: booking_enum_1.bookingStatus.COMPLETED,
        },
    }, {
        returnDocument: "after",
        runValidators: true,
    });
    if (!booking) {
        throw new Error("Booking not found or cannot be completed");
    }
    await notifyCustomer(String(booking.customerId), String(booking._id), booking_enum_1.bookingStatus.COMPLETED);
    return booking;
};
exports.completeBooking = completeBooking;
