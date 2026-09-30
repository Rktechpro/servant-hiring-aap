import { Servant } from "../servant/servant.model";
import { CreateBookingDto } from "./booking.dto";
import { bookingStatus } from "./booking.enum";
import { Booking } from "./booking.model";

export const createBooking = async (customerId: string, data: CreateBookingDto) => {
    const servant = await Servant.findOne({ userId: data.servantId, isActive: true })

    if (!servant)
        throw new Error("Servant not found");
    if (!servant.availability)
        throw new Error("Servant is currently unavailable");

    const hourlyPrice = servant.hourlyPrice;
    const totalAmount = data.hours * hourlyPrice

    const payload = {
        customerId,
        servantId: data.servantId,
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        hours: data.hours,
        hourlyPrice,
        totalAmount,
        location: data.location,
        address: data.address,
        status: bookingStatus.PENDING
    }

    const booking = await Booking.create(payload)
    return booking

}

// CUSTOMER BOOKINGS
export const getMyBookings = async (customerId: string) => {
    const bookings = await Booking.find({ customerId, })
        .populate("servantId")
        .sort({ createdAt: -1 });

    return bookings;
};

// SERVANT BOOKING REQUESTS
export const getBookingRequests = async (servantId: string) => {
    const bookings = await Booking.find({
        servantId,
        status: bookingStatus.PENDING
    })
        .populate("customerId")
        .sort({ createdAt: -1 });

    return bookings;
};

// SINGLE BOOKING
export const getBookingById = async (
    bookingId: string,
    userId: string
) => {
    const booking = await Booking.findOne({
        _id: bookingId,
        $or: [
            { customerId: userId },
            { servantId: userId },
        ],
    })
        .populate("customerId")
        .populate("servantId");

    if (!booking) {
        throw new Error("Booking not found");
    }

    return booking;
};

// ACCEPT BOOKING
export const acceptBooking = async (
    bookingId: string,
    servantId: string
) => {
    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            servantId,
            status: bookingStatus.PENDING,
        },
        {
            $set: {
                status: bookingStatus.ACCEPTED
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error(
            "Booking not found or cannot be accepted"
        );
    }

    return booking;
};


// REJECT BOOKING
export const rejectBooking = async (
    bookingId: string,
    servantId: string
) => {
    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            servantId,
            status: bookingStatus.PENDING
        },
        {
            $set: {
                status: bookingStatus.REJECTED
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error(
            "Booking not found or cannot be rejected"
        );
    }

    return booking;
};


// CANCEL BOOKING
export const cancelBooking = async (
    bookingId: string,
    customerId: string
) => {
    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            customerId,
            status: {
                $in: [bookingStatus.PENDING, bookingStatus.ACCEPTED],
            },
        },
        {
            $set: {
                status: bookingStatus.CANCELLED
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error(
            "Booking not found or cannot be cancelled"
        );
    }

    return booking;
};


// COMPLETE BOOKING
export const completeBooking = async (
    bookingId: string,
    servantId: string
) => {
    const booking = await Booking.findOneAndUpdate(
        {
            _id: bookingId,
            servantId,
            status: bookingStatus.ACCEPTED
        },
        {
            $set: {
                status: bookingStatus.COMPLETED
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    );

    if (!booking) {
        throw new Error(
            "Booking not found or cannot be completed"
        );
    }

    return booking;
};