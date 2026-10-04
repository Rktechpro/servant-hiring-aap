import { Router, Request, Response } from "express";
import * as paymentService from "./payment.service";
import { createPaymentOrderSchema } from "./payment.Dto";
import { AuthRequest } from "../auth/auth.interface";
import { authMiddleware } from "../auth/auth.middelware";

export const paymentController = Router();

paymentController.post("/create-order", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const body = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = createPaymentOrderSchema.safeParse(body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues,
            });
        }

        const payment =
            await paymentService.createPaymentOrder(
                userId,
                result.data.bookingId
            );

        return res.status(201).json({
            message: "Payment order created successfully",
            data: payment,
        });
    } catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
}
);

paymentController.post(
    "/webhook",
    async (req: Request, res: Response) => {
        try {
            const signature = req.headers["x-razorpay-signature"];

            if (!signature) {
                return res.status(400).json({
                    success: false,
                    message: "Razorpay signature missing",
                });
            }

            if (Array.isArray(signature)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Razorpay signature",
                });
            }

            const result =
                await paymentService.handleRazorpayWebhook(
                    req.body,
                    signature
                );

            return res.status(200).json(result);
        } catch (error: unknown) {
            console.error(
                "Razorpay Webhook Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Webhook processing failed",
            });
        }
    }
);