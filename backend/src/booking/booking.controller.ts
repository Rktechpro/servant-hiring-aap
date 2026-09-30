import { Router, Request, Response } from "express";
import * as bookingService from "./booking.service";
import { createBookingSchema } from "./booking.dto";
import { AuthRequest } from "../auth/auth.interface";
import { authMiddleware } from "../auth/auth.middelware";

export const bookingController = Router();

// CREATE BOOKING - CUSTOMER
bookingController.post("/createBooking", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const customerId = req.user?.id;
        const body = req.body

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = createBookingSchema.safeParse(body);

        if (!result.success)
            return res.status(400).json({ errors: result.error.issues, });

        const booking = await bookingService.createBooking(
            customerId,
            result.data
        );

        return res.status(201).json({
            message: "Booking created successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});


// CUSTOMER - MY BOOKINGS
bookingController.get("/my-bookings", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const customerId = req.user?.id;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const bookings = await bookingService.getMyBookings(customerId);

        return res.status(200).json({
            message: "Bookings fetched successfully",
            data: bookings,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })

    }
});


// SERVANT - BOOKING AuthRequestS
bookingController.get("/AuthRequests", async (req: AuthRequest, res: Response) => {
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
            message: "Booking AuthRequests fetched successfully",
            data: bookings,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});


// GET SINGLE BOOKING
bookingController.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const booking = await bookingService.getBookingById(
            req.params.id as string,
            userId
        );

        return res.status(200).json({
            message: "Booking fetched successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});


// SERVANT - ACCEPT BOOKING
bookingController.patch("/accept/:id", async (req: AuthRequest, res: Response) => {
    try {
        const servantId = req.user?.id;

        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const booking = await bookingService.acceptBooking(
            req.params.id as string,
            servantId
        );

        return res.status(200).json({
            message: "Booking accepted successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});


// SERVANT - REJECT BOOKING
bookingController.patch("/reject/:id", async (req: AuthRequest, res: Response) => {
    try {
        const servantId = req.user?.id;

        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const booking = await bookingService.rejectBooking(
            req.params.id as string,
            servantId
        );

        return res.status(200).json({
            success: true,
            message: "Booking rejected successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});


// CUSTOMER - CANCEL BOOKING
bookingController.patch("/cancel/:id", async (req: AuthRequest, res: Response) => {
    try {
        const customerId = req.user?.id;

        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const booking = await bookingService.cancelBooking(
            req.params.id as string,
            customerId
        );

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});


// SERVANT - COMPLETE BOOKING
bookingController.patch("/complete/:id", async (req: AuthRequest, res: Response) => {
    try {
        const servantId = req.user?.id;

        if (!servantId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const booking = await bookingService.completeBooking(
            req.params.id as string,
            servantId
        );

        return res.status(200).json({
            success: true,
            message: "Booking completed successfully",
            data: booking,
        });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
});

