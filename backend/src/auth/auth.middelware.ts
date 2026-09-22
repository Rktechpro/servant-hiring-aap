import jwt from 'jsonwebtoken'
import { AuthRequest, authSingupInterface, cookieOptions } from './auth.interface'
import { NextFunction, Response } from 'express'


const options: cookieOptions = {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
    domain: process.env.CLIENT_DOMAIN,
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: "lax" as const
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET!) as authSingupInterface
        req.user = decode
        next()


    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.clearCookie("accessToken", options)
            return res.status(401).json({
                success: false, message: "Access token expired",
            });
        }
        res.clearCookie("accessToken", options)

        if (err instanceof jwt.JsonWebTokenError)
            return res.status(401).json({
                success: false, message: "Invalid token",
            })

    }
}