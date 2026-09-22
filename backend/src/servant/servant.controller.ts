import { Response, Router } from "express";
import { AuthRequest } from "../auth/auth.interface";
import * as servantService from './servant.service'
import { authMiddleware } from "../auth/auth.middelware";
import { createServantSchema } from "./servant.dto";
export const servantController = Router()

servantController.post("/createServant", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id
        const body = req.body

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const data = createServantSchema.parse(body)
        const servant = await servantService.createServant(userId, data)

        res.status(200).json({ message: "Servant Data Create SuccessFull!", data: servant })

    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
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
    try {
        const userId = req.user?.id
        const body = req.body

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const data = createServantSchema.parse(body)
        const updateServantData = await servantService.updateDataServant(userId, data)

        res.status(200).json({
            message: "Servant profile updated successfully",
            data: updateServantData
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
})
servantController.delete("/deleteServant", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });


        const deleteServantData = await servantService.deleteDataServant(userId)

        res.status(200).json({
            message: "Servant profile delete successfully",
            data: deleteServantData
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message })
    }
})