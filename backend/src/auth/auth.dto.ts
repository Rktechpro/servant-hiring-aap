import { z } from 'zod'
import { RoleEnum } from './auth.enum';

export const authSingup = z.object({
    fullname: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim(),

    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    mobile: z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must not exceed 50 characters"),

    role: z.enum([RoleEnum.CUSTOMER, RoleEnum.SERVANT])
}).strict()

export const authlogin = z.object({
    email: z
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    role: z.enum([
        RoleEnum.CUSTOMER,
        RoleEnum.SERVANT
    ])

}).strict()

export type SignupInput = z.infer<typeof authSingup>;
export type LoginInput = z.infer<typeof authlogin>;
