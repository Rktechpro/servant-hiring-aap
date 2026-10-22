import { Servant } from "../servant/servant.model";
import { Customer } from "../customer/customer.model";
import { getIO } from "../socket/Booking.Socket";
import { CreateBookingDto } from "./booking.dto";
import { bookingStatus } from "./booking.enum";
import { Booking } from "./booking.model";
import { Types } from "mongoose";
import { authModel } from "../auth/auth.model";

// CUSTOMER - CREATE BOOKING
export const createBooking = async (customerId: string, data: CreateBookingDto) => {
    const servant = await Servant.findOne({ _id: data.servantId, isActive: true });
    if (!servant)
        throw new Error("Servant not found");

    if (!servant.availability)
        throw new Error("Servant is currently unavailable");

    const hourlyPrice = servant.hourlyPrice;
    const totalAmount = data.hours * hourlyPrice;

    const booking = await Booking.create({
        customerId,
        servantId: servant._id,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        hours: data.hours,
        hourlyPrice,
        totalAmount,
        location: data.location,
        address: data.address,
        status: bookingStatus.PENDING,
    });

    // Notify servant after the booking is saved
    getIO()
        .to(`user:${String(servant.userId)}`)
        .emit("booking:new", {
            booking: booking.toObject(),
        });

    return booking;
};

export const getMyBookings = async (userId: string, role: string) => {
    let match: any;

    if (role === "CUSTOMER") {
        match = { customerId: new Types.ObjectId(userId) };

    }
    else if (role === "SERVANT") {
        const servant = await Servant.findOne({
            userId: new Types.ObjectId(userId),
        });

        if (!servant) {
            throw new Error("Servant not found");
        }

        match = { servantId: servant._id };
    } else {
        throw new Error("Invalid role");
    }

    return Booking.aggregate([
        { $match: match },

        // Customer fullname and mobile
        {
            $lookup: {
                from: Customer.collection.name,
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
                            from: authModel.collection.name,
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
                from: Servant.collection.name,
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
                from: authModel.collection.name,
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
export const getBookingRequests = async (servantUserId: string) => {
    // Logged-in User ID se Servant document find karo
    const servant = await Servant.findOne({
        userId: servantUserId,
    });

    if (!servant) {
        throw new Error("Servant profile not found for this user");
    }

    // Booking mein Servant document ki _id use hoti hai
    return Booking.find({
        servantId: servant._id,
        status: bookingStatus.PENDING,
    })
        .populate("customerId")
        .sort({ createdAt: -1 });
};


// Helper: notify the customer who created the booking
const notifyCustomer = async (customerId: string, bookingId: string, status: bookingStatus
) => {
    // Assumes Booking.customerId references a Customer document
    // and Customer.userId references the authenticated User.
    const customer = await Customer.findById(customerId).select("userId");

    if (!customer?.userId) {
        console.error("Customer userId not found for booking:", bookingId);
        return;
    }

    const message =
        status === bookingStatus.ACCEPTED
            ? "Your booking has been accepted by the servant."
            : status === bookingStatus.REJECTED
                ? "Your booking has been rejected by the servant."
                : status === bookingStatus.CANCELLED
                    ? "Your booking has been cancelled."
                    : status === bookingStatus.COMPLETED
                        ? "Your booking has been completed."
                        : `Your booking status is ${status}.`;

    getIO()
        .to(`user:${String(customer.userId)}`)
        .emit("booking:status", {
            bookingId,
            status,
            message,
        });
};

// SERVANT - ACCEPT BOOKING

export const acceptBooking = async (
    bookingId: string,
    servantUserId: string
) => {
    const servant = await Servant.findOne({
        userId: servantUserId,
    });

    if (!servant) {
        throw new Error("Servant profile not found");
    }

    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            servantId: servant._id,
            status: bookingStatus.PENDING,
        },
        {
            $set: { status: bookingStatus.ACCEPTED },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error(
            "Booking not found, already processed, or does not belong to this servant"
        );
    }

    return booking;
};

// SERVANT - REJECT BOOKING
export const rejectBooking = async (
    bookingId: string,
    servantUserId: string
) => {
    const servant = await Servant.findOne({
        userId: servantUserId,
    });

    if (!servant) {
        throw new Error("Servant profile not found");
    }

    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            servantId: servant._id,
            status: bookingStatus.PENDING,
        },
        {
            $set: { status: bookingStatus.REJECTED },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error(
            "Booking not found, already processed, or does not belong to this servant"
        );
    }

    return booking;
};

// CUSTOMER - CANCEL BOOKING
export const cancelBooking = async (
    bookingId: string,
    customerId: string
) => {
    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            customerId,
            status: {
                $in: [
                    bookingStatus.PENDING,
                    bookingStatus.ACCEPTED,
                ],
            },
        },
        {
            $set: {
                status: bookingStatus.CANCELLED,
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error("Booking not found or cannot be cancelled");
    }

    // Notify the servant about cancellation
    const servant = await Servant.findById(booking.servantId)
        .select("userId");

    if (servant?.userId) {
        getIO()
            .to(`user:${String(servant.userId)}`)
            .emit("booking:status", {
                bookingId: String(booking._id),
                status: bookingStatus.CANCELLED,
                message: "The customer has cancelled this booking.",
            });
    }

    return booking;
};

// SERVANT - COMPLETE BOOKING
export const completeBooking = async (
    bookingId: string,
    servantId: string
) => {
    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            servantId,
            status: bookingStatus.ACCEPTED,
        },
        {
            $set: {
                status: bookingStatus.COMPLETED,
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error("Booking not found or cannot be completed");
    }

    await notifyCustomer(
        String(booking.customerId),
        String(booking._id),
        bookingStatus.COMPLETED
    );

    return booking;
};
