import { z } from "zod";

export const createCustomerSchema = z.object({
    image: z.url().optional(),
    address: z.string().max(300, "Address is Required").optional(),
    location: z.string().max(100, "Location is Required").optional(),
});

export type createCustomerDto = z.infer<typeof createCustomerSchema>;
