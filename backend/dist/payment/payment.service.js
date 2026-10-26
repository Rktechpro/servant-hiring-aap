import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import Razorpay from "razorpay";
import { Booking } from "../booking/booking.model";
import { Customer } from "../customer/customer.model";
import { Payment } from "./payment.model";
import { PaymentStatus } from "./payment.enum";
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const createPaymentOrder = async (customerUserId, bookingId) => {
    const customer = await Customer.findOne({ userId: customerUserId });
    if (!customer)
        throw new Error("Customer profile not found");
    const booking = await Booking.findOne({ _id: bookingId, customerId: customerUserId });
    if (!booking)
        throw new Error("Booking not found");
    if (booking.status !== "ACCEPTED")
        throw new Error("Payment is allowed only for accepted bookings");
    const existingPayment = await Payment.findOne({ bookingId: booking._id });
    if (existingPayment?.status === PaymentStatus.PAID)
        throw new Error("Booking is already paid");
    const amount = Math.round(booking.totalAmount * 100);
    const order = await razorpay.orders.create({
        amount,
        currency: process.env.CURRENCY,
        receipt: `rec_${booking._id}`,
    });
    await Payment.findOneAndUpdate({ bookingId: booking._id }, {
        $set: {
            bookingId: booking._id,
            customerId: customer._id,
            amount: booking.totalAmount,
            currency: process.env.CURRENCY,
            razorpayOrderId: order.id,
            status: PaymentStatus.PENDING,
        },
    }, {
        upsert: true,
        new: true,
        runValidators: true,
    });
    return {
        bookingId: booking._id,
        razorpayOrderId: order.id,
        amount,
        currency: process.env.CURRENCY,
        keyId: process.env.RAZORPAY_KEY_ID,
    };
};
export const razorpayWebhook = async (data, signature) => {
    console.log("🔥 Razorpay webhook service called");
    // 1. Verify Razorpay webhook signature
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(data, "utf8")
        .digest("hex");
    if (signature !== expectedSignature)
        throw new Error("Invalid request");
    console.log("✅ Webhook signature verified");
    // 2. Parse and save verified payload
    const body = JSON.parse(data);
    // const filePath = path.resolve(process.cwd(), "payment.json");
    // fs.writeFileSync(
    //     filePath,
    //     JSON.stringify(body, null, 2),
    //     "utf8"
    // );
    // 4. Update database status
    const paymentEntity = body.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    if (body.event === "payment.captured") {
        if (!orderId || !paymentEntity?.id || paymentEntity.status !== "captured" ||
            paymentEntity.captured !== true) {
            throw new Error("Payment is not confirmed as captured");
        }
        const payment = await Payment.findOneAndUpdate({ razorpayOrderId: orderId }, {
            $set: {
                status: PaymentStatus.PAID,
                razorpayPaymentId: paymentEntity.id,
            },
        });
        if (!payment)
            throw new Error(`Payment record not found for order: ${orderId}`);
        console.log("✅ Payment updated:", {
            id: payment._id,
            orderId: payment.razorpayOrderId,
            paymentId: payment.razorpayPaymentId,
            status: payment.status,
        });
    }
    else if (body.event === "payment.failed") {
        if (!orderId || !paymentEntity?.id)
            throw new Error("Failed payment details missing");
        const payment = await Payment.findOneAndUpdate({
            razorpayOrderId: orderId,
            status: { $ne: PaymentStatus.PAID },
        }, {
            $set: {
                status: PaymentStatus.FAILED,
                razorpayPaymentId: paymentEntity.id,
            },
        });
        console.log("Failed payment update:", {
            orderId,
            paymentId: paymentEntity.id,
            status: payment?.status ?? "No eligible record found",
        });
    }
    else if (body.event === "payment.authorized") {
        console.log("⏳ Payment authorized; waiting for capture");
    }
    else {
        console.log("No status update for event:", body.event);
    }
    return body;
};
