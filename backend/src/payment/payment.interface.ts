import { Document, Types } from "mongoose";
import { PaymentStatus } from "./payment.enum";

export interface IPayment extends Document {
    bookingId: Types.ObjectId;
    customerId: Types.ObjectId;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}