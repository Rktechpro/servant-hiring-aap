import { Response, Router } from "express";
import { AuthRequest } from "../auth/auth.interface";
import * as servantService from './servant.service'
import { authMiddleware } from "../auth/auth.middelware";
import { createServantSchema } from "./servant.dto";
import mongoose from "mongoose";
export const servantController = Router()

servantController.post("/createServant", authMiddleware, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession()
    try {
        const userId = req.user?.id
        const body = req.body
        session.startTransaction()

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const data = createServantSchema.parse(body)
        const [servant] = await servantService.createServant(userId, data, session)
        await session.commitTransaction()
        res.status(200).json({ message: "Servant Data Create SuccessFull!", data: servant })

    }
    catch (err) {
        await session.abortTransaction()
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
    finally {
        await session.endSession()
    }
})

servantController.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const servant = await servantService.getServant()
        res.status(200).json(servant)
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
})

servantController.put("/updateServant", authMiddleware, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession()
    try {
        const userId = req.user?.id
        const body = req.body
        session.startTransaction()

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const data = createServantSchema.parse(body)
        const updateServantData = await servantService.updateDataServant(userId, data, session)
        await session.commitTransaction()
        res.status(200).json({
            message: "Servant profile updated successfully",
            data: updateServantData
        });
    }
    catch (err) {
        await session.abortTransaction()
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
    finally {
        await session.endSession()
    }
})
servantController.delete("/deleteServant", authMiddleware, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession()
    try {
        const userId = req.user?.id
        session.startTransaction()
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });


        const deleteServantData = await servantService.deleteDataServant(userId, session)
        await session.commitTransaction()
        res.status(200).json({
            message: "Servant profile delete successfully",
            data: deleteServantData
        });
    }
    catch (err) {
        await session.abortTransaction()
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
    finally {
        await session.endSession()
    }
})