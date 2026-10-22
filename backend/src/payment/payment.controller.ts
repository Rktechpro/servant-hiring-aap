
import { Router, Request, Response } from "express";
import * as paymentService from "./payment.service";
import { createPaymentOrderSchema } from "./payment.Dto";
import { AuthRequest } from "../auth/auth.interface";
import { authMiddleware } from "../auth/auth.middelware";

export const paymentController = Router();

paymentController.post("/create-order/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const bookingId = req.params?.id;

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const result = createPaymentOrderSchema.safeParse({ bookingId });

        if (!result.success)
            return res.status(400).json({ errors: result.error.issues });

        const payment = await paymentService.createPaymentOrder(userId, result.data.bookingId
        );

        return res.status(201).json({
            message: "Payment order created successfully",
            data: payment,
        });

    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
});


// https://z77s88hp-8080.inc1.devtunnels.ms/payment/webhook


paymentController.post("/webhook", async (req: Request, res: Response) => {
    console.log("🔥 WEBHOOK CONTROLLER HIT");
    try {
        const body = req.body
        const signature = req.headers["x-razorpay-signature"];

        if (!signature)
            return res.status(400).json({
                message: "Missing signature or raw request body",
            });

        const data = JSON.stringify(body)

        const result = await paymentService.razorpayWebhook(
            data,
            signature
        );

        return res.status(200).json({ event: result.event });

    } catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })

        return res.status(500).json({ message: "Internal server error" });
    }
});
