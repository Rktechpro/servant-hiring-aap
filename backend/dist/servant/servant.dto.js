"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServantSchema = void 0;
const zod_1 = require("zod");
exports.createServantSchema = zod_1.z.object({
    image: zod_1.z
        .url("Invalid photo URL")
        .optional(),
    bio: zod_1.z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .optional(),
    skills: zod_1.z
        .array(zod_1.z.string())
        .optional(),
    servantlocation: zod_1.z
        .string()
        .min(2, "Location is required"),
    servantAddress: zod_1.z
        .string()
        .min(2, "Address is required"),
    hourlyPrice: zod_1.z
        .number()
        .positive("Hourly price must be greater than 0"),
    availability: zod_1.z
        .boolean()
        .optional(),
}).strict();
