import { Request } from "express";
import { RoleEnum } from "./auth.enum";



export interface authSingupInterface {
    id: string | undefined;
    fullname: string;
    email: string;
    mobile: string;
    password: string;
    role: RoleEnum;
}

export interface AuthRequest extends Request {
    user?: authSingupInterface
}


export interface cookieOptions {
    httpOnly: boolean;
    maxAge: number;
    domain: string | undefined;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
}