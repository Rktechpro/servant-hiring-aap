import { Request, Response, Router } from "express";
import * as authService from './auth.service'
import mongoose from "mongoose";

export const authControlller = Router()

authControlller.post("/signup", async (req: Request, res: Response) => {
    const session = await mongoose.startSession()
    try {
        const body = req.body
        session.startTransaction()
        const [user] = await authService.authSignup(body, session)

        await session.commitTransaction()
        res.json(user)
    }
    catch (err) {
        await session.abortTransaction();
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
    finally {
        await session.endSession()
    }
})

authControlller.post("/login", async (req: Request, res: Response) => {
    try {
        const body = req.body
        const userSigIn = await authService.authLogin(body)

        res.cookie("accessToken", userSigIn.accessToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: 'none'
        })

        res.cookie("refereshToken", userSigIn.refreshToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_REFERSH_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: "none"
        })

        res.cookie("role", userSigIn.user.role, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
            secure: process.env.NODE_ENV === "dev"? false :true,
            sameSite: 'none'
        });

        res.status(201).json({
            message: 'Login Success!', data: {
                user: userSigIn.user,
            }
        })
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
})

authControlller.post("/logout", async (req: Request, res: Response) => {
    try {
        const signOut = await authService.logout()
        const cookieOption = {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: 'lax' as const
        }
        res.clearCookie("accessToken", cookieOption)
        res.clearCookie("refreshToken", cookieOption)

        res.status(201).json({
            message: signOut.message
        })

    } 
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
})

