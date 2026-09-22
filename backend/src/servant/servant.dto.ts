import { z } from "zod";

export const createServantSchema = z.object({
    image: z
        .url("Invalid photo URL")
        .optional(),

    bio: z
        .string()
        .max(500, "Bio cannot exceed 500 characters")
        .optional(),

    skills: z
        .array(z.string())
        .optional(),

    location: z
        .string()
        .min(2, "Location is required"),

    hourlyPrice: z
        .number()
        .positive("Hourly price must be greater than 0"),

    availability: z
        .boolean()
        .optional(),
}).strict()

export type CreateServantInput = z.infer<typeof createServantSchema>
