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
exports.bookingController = void 0;
const express_1 = require("express");
const bookingService = __importStar(require("./booking.service"));
const booking_dto_1 = require("./booking.dto");
const auth_middelware_1 = require("../auth/auth.middelware");
exports.bookingController = (0, express_1.Router)();
exports.bookingController.post("/createBooking", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const customerId = req.user?.id;
        const body = req.body;
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = booking_dto_1.createBookingSchema.safeParse(body);
        if (!result.success)
            return res.status(400).json({ errors: result.error.issues, });
        const booking = await bookingService.createBooking(customerId, result.data);
        return res.status(201).json({
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message });
    }
});
// 1.bookings get
exports.bookingController.get("/my-bookings", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const customerId = req.user?.id;
        const role = req.user?.role;
        if (!customerId || !role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const bookings = await bookingService.getMyBookings(customerId, role);
        return res.status(200).json({
            message: "Bookings fetched successfully",
            data: bookings,
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
// 2. Servant booking requests
exports.bookingController.get("/AuthRequests", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const servantId = req.user?.id;
        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const bookings = await bookingService.getBookingRequests(servantId);
        return res.status(200).json({
            message: "Booking requests fetched successfully",
            data: bookings,
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
// SERVANT - ACCEPT BOOKING
exports.bookingController.patch("/accept/:id", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const servantId = req.user?.id;
        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const booking = await bookingService.acceptBooking(req.params.id, servantId);
        return res.status(200).json({
            success: true,
            message: "Booking accepted successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
// SERVANT - REJECT BOOKING
exports.bookingController.patch("/reject/:id", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const servantId = req.user?.id;
        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const booking = await bookingService.rejectBooking(req.params.id, servantId);
        return res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
// CUSTOMER - CANCEL BOOKING
exports.bookingController.patch("/cancel/:id", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const customerId = req.user?.id;
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const booking = await bookingService.cancelBooking(req.params.id, customerId);
        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
// SERVANT - COMPLETE BOOKING
exports.bookingController.patch("/complete/:id", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const servantId = req.user?.id;
        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const booking = await bookingService.completeBooking(req.params.id, servantId);
        return res.status(200).json({
            success: true,
            message: "Booking completed successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
