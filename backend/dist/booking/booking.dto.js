"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    servantId: zod_1.z.string().min(1, "Servant ID is required"),
    bookingDate: zod_1.z.coerce.date(),
    startTime: zod_1.z.string().min(1, "Start time is required"),
    endTime: zod_1.z.string().min(1, "End time is required"),
    hours: zod_1.z.number().positive("Hours must be greater than 0"),
    location: zod_1.z.string().min(2, "Location is required"),
    address: zod_1.z.string().min(2, "Address is required"),
});
