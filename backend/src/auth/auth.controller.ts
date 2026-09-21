import { Request, Response, Router } from "express";
import * as authService from './auth.service'

export const authControlller = Router()

authControlller.post("/signup", async (req: Request, res: Response) => {
    try {
        const body = req.body
        const user = await authService.authSignup(body)
        res.json(user)
    } catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })

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
            sameSite: 'lax'
        })

        res.cookie("refereshToken", userSigIn.refreshToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_REFERSH_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: "lax"
        })

        res.cookie("role", userSigIn.user.role, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
            secure: process.env.NODE_ENV === "dev",
            sameSite: "lax",
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