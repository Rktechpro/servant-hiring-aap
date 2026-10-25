"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
exports.createCustomerSchema = zod_1.z.object({
    image: zod_1.z.url().optional(),
    addressCustomer: zod_1.z.string().max(300, "Address is Required").optional(),
    locationCustomer: zod_1.z.string().max(100, "Location is Required").optional(),
});
