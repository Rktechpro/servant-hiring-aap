import { Schema, model } from "mongoose";
import { bookingInterface } from "./booking.interface";
import { bookingStatus } from "./booking.enum";


const bookingSchema = new Schema<bookingInterface>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        servantId: {
            type: Schema.Types.ObjectId,
            ref: "Servant",
            required: true,
        },

        bookingDate: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        hours: {
            type: Number,
            required: true,
            min: 1,
        },

        hourlyPrice: {
            type: Number,
            required: true,
            min: 1,
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 1,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(bookingStatus),
            default: bookingStatus.PENDING
        },
    },
    {
        timestamps: true,
    }
);

export const Booking = model<bookingInterface>("Booking", bookingSchema);