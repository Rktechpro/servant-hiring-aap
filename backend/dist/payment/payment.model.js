import { Schema, model } from "mongoose";
import { PaymentStatus } from "./payment.enum";
const paymentSchema = new Schema({
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
    },
    razorpaySignature: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    },
}, {
    timestamps: true,
});
export const Payment = model("Payment", paymentSchema);
