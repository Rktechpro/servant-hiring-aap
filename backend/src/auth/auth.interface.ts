import { Request } from "express";
import { RoleEnum } from "./auth.enum";



export interface authSingupInterface {
    fullname: string;
    email: string;
    mobile: string;
    password: string;
    role: RoleEnum;
}

export interface AuthRequest extends Request {
    user?: authSingupInterface
}