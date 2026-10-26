import { z } from "zod";
export const createCustomerSchema = z.object({
    image: z.url().optional(),
    addressCustomer: z.string().max(300, "Address is Required").optional(),
    locationCustomer: z.string().max(100, "Location is Required").optional(),
});
