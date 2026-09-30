import { z } from "zod";

export const createBookingSchema = z.object({
    servantId: z.string().min(1, "Servant ID is required"),
    bookingDate: z.coerce.date(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    hours: z.number().positive("Hours must be greater than 0"),
    location: z.string().min(2, "Location is required"),
    address: z.string().min(2, "Address is required"),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;