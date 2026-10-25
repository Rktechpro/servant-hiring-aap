"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authlogin = exports.authSingup = void 0;
const zod_1 = require("zod");
const auth_enum_1 = require("./auth.enum");
exports.authSingup = zod_1.z.object({
    fullname: zod_1.z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim(),
    email: zod_1.z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),
    mobile: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must not exceed 50 characters"),
    role: zod_1.z.enum([auth_enum_1.RoleEnum.CUSTOMER, auth_enum_1.RoleEnum.SERVANT])
}).strict();
exports.authlogin = zod_1.z.object({
    email: zod_1.z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters"),
    role: zod_1.z.enum([
        auth_enum_1.RoleEnum.CUSTOMER,
        auth_enum_1.RoleEnum.SERVANT
    ])
}).strict();
