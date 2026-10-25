"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const express_1 = require("express");
const paymentService = __importStar(require("./payment.service"));
const payment_Dto_1 = require("./payment.Dto");
const auth_middelware_1 = require("../auth/auth.middelware");
exports.paymentController = (0, express_1.Router)();
exports.paymentController.post("/create-order/:id", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const bookingId = req.params?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const result = payment_Dto_1.createPaymentOrderSchema.safeParse({ bookingId });
        if (!result.success)
            return res.status(400).json({ errors: result.error.issues });
        const payment = await paymentService.createPaymentOrder(userId, result.data.bookingId);
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
exports.paymentController.post("/webhook", async (req, res) => {
    console.log("🔥 WEBHOOK CONTROLLER HIT");
    try {
        const body = req.body;
        const signature = req.headers["x-razorpay-signature"];
        if (!signature)
            return res.status(400).json({
                message: "Missing signature or raw request body",
            });
        const data = JSON.stringify(body);
        const result = await paymentService.razorpayWebhook(data, signature);
        return res.status(200).json({ event: result.event });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
        return res.status(500).json({ message: "Internal server error" });
    }
});
