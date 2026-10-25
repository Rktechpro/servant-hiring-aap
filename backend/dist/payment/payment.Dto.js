"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaymentSchema = exports.createPaymentOrderSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentOrderSchema = zod_1.z.object({
    bookingId: zod_1.z.string().min(1, "Booking ID is required"),
});
exports.verifyPaymentSchema = zod_1.z.object({
    razorpay_order_id: zod_1.z.string().min(1),
    razorpay_payment_id: zod_1.z.string().min(1),
    razorpay_signature: zod_1.z.string().min(1),
});
