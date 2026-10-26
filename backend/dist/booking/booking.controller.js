import { Router } from "express";
import * as bookingService from "./booking.service";
import { createBookingSchema } from "./booking.dto";
import { authMiddleware } from "../auth/auth.middelware";
export const bookingController = Router();
bookingController.post("/createBooking", authMiddleware, async (req, res) => {
    try {
        const customerId = req.user?.id;
        const body = req.body;
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = createBookingSchema.safeParse(body);
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
bookingController.get("/my-bookings", authMiddleware, async (req, res) => {
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
bookingController.get("/AuthRequests", authMiddleware, async (req, res) => {
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
bookingController.patch("/accept/:id", authMiddleware, async (req, res) => {
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
bookingController.patch("/reject/:id", authMiddleware, async (req, res) => {
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
bookingController.patch("/cancel/:id", authMiddleware, async (req, res) => {
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
bookingController.patch("/complete/:id", authMiddleware, async (req, res) => {
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
