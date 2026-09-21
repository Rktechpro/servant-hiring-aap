import { Response, Router } from "express";
import { AuthRequest } from "../auth/auth.interface";
import * as Store from './store.service'

export const storeController = Router()

storeController.post(
    "/upload",
    async (req: AuthRequest, res: Response) => {
        try {
            const path = req.body?.path
            const type = req.body?.type
            const status = req.body?.status

            if (!path || !type || !status)
                return res.status(400).json({ message: 'Invalid request path or type is required' })


            const candidate =
                await Store.storage(
                    type,
                    path,
                    status,

                );

            return res.status(200).json({
                success: true,
                message: "Upload URL generated successfully",
                data: candidate,
            });
        } catch (err) {
            if (err instanceof Error)
                return res.status(500).json
        }
    }
);
