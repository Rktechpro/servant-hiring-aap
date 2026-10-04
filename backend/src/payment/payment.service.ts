import crypto from "crypto"
import Razorpay from "razorpay";
import { Booking } from "../booking/booking.model";
import { Customer } from "../customer/customer.model";
import { Payment } from "./payment.model";
import { PaymentStatus } from "./payment.enum";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createPaymentOrder = async (customerUserId: string, bookingId: string) => {
    const customer = await Customer.findOne({ userId: customerUserId });

    if (!customer)
        throw new Error("Customer profile not found");

    const booking = await Booking.findOne({ _id: bookingId, customerId: customer._id });

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
        currency: "INR",
        receipt: `Rec_${booking._id}`,
    });

    await Payment.findOneAndUpdate(
        {
            bookingId: booking._id,
        },
        {
            $set: {
                bookingId: booking._id,
                customerId: customer._id,
                amount: booking.totalAmount,
                currency: "INR",
                razorpayOrderId: order.id,
                status: PaymentStatus.PENDING,
            },
        },
        {
            upsert: true,
            returnDocument: "after",
            runValidators: true,
        }
    );

    return {
        bookingId: booking._id,
        razorpayOrderId: order.id,
        amount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
    };
};

export const handleRazorpayWebhook = async (
    rawBody: Buffer,
    signature: string
) => {
    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_WEBHOOK_SECRET!
        )
        .update(rawBody)
        .digest("hex");

    if (
        !crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signature)
        )
    ) {
        throw new Error("Invalid Razorpay webhook signature");
    }

    const event = JSON.parse(rawBody.toString());

    console.log("Razorpay Event:", event.event);

    // Payment captured / order paid
    if (
        event.event === "payment.captured" ||
        event.event === "order.paid"
    ) {
        const paymentEntity =
            event.payload?.payment?.entity;

        const orderEntity =
            event.payload?.order?.entity;

        const razorpayOrderId =
            paymentEntity?.order_id ||
            orderEntity?.id;

        const razorpayPaymentId =
            paymentEntity?.id;

        if (!razorpayOrderId) {
            throw new Error(
                "Razorpay order ID not found"
            );
        }

        const payment = await Payment.findOne({
            razorpayOrderId,
        });

        if (!payment) {
            throw new Error(
                "Payment record not found"
            );
        }

        // Idempotency
        if (payment.status === PaymentStatus.PAID) {
            return {
                success: true,
                message: "Payment already processed",
            };
        }

        await Payment.findByIdAndUpdate(
            payment._id,
            {
                $set: {
                    razorpayPaymentId,
                    status: PaymentStatus.PAID,
                },
            },
            {
                returnDocument: "after",
            }
        );

        // Optional: update booking
        await Booking.findByIdAndUpdate(
            payment.bookingId,
            {
                $set: {
                    paymentStatus: "PAID",
                },
            }
        );

        return {
            success: true,
            message: "Payment marked as paid",
        };
    }

    // Payment failed
    if (event.event === "payment.failed") {
        const paymentEntity =
            event.payload?.payment?.entity;

        const razorpayOrderId =
            paymentEntity?.order_id;

        if (razorpayOrderId) {
            await Payment.findOneAndUpdate(
                {
                    razorpayOrderId,
                },
                {
                    $set: {
                        status: PaymentStatus.FAILED,
                    },
                }
            );
        }

        return {
            success: true,
            message: "Payment marked as failed",
        };
    }

    return {
        success: true,
        message: "Webhook received",
    };
};