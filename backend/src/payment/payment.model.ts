import { Schema, model } from "mongoose";
import { PaymentStatus } from "./payment.enum";
import { paymentInterface } from "./payment.interface";

const paymentSchema = new Schema<paymentInterface>(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            unique: true,
        },

        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        currency: {
            type: String,
            default: "INR",
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = model<paymentInterface>("Payment", paymentSchema);