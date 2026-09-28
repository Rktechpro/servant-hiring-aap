import { Response, Router } from "express";
import { AuthRequest } from "../auth/auth.interface";
import { authMiddleware } from "../auth/auth.middelware";
import * as customerService from './customer.service'
import mongoose from "mongoose";

export const customerController = Router()

customerController.post("/createCustomer", authMiddleware, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession()
    try {
        const userId = req.user?.id
        const body = req.body
        session.startTransaction()
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const customerData = await customerService.createCustomer(userId, body, session)
        await session.commitTransaction()
        res.status(200).json({ message: "Create Customer Profile SuccessFull ", data: customerData })

    }
    catch (err) {
        await session.abortTransaction()
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
    finally {
        await session.endSession()
    }
})
customerController.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const getData = await customerService.getCustomer(userId)
        res.status(200).json({ message: "Customer get Data Success! ", data: getData })

    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
})

customerController.put("/updateCustomer", authMiddleware, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession()
    try {
        const userId = req.user?.id
        const body = req.body
        session.startTransaction()

        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });

        const updateCustomers = await customerService.updateCustomer(userId, body, session)

        await session.commitTransaction()
        res.status(200).json({ message: "Customer Update Success! ", data: updateCustomers })

    }
    catch (err) {
        await session.abortTransaction()
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    }
    finally {
        await session.endSession()
    }
})
customerController.delete("/deleteCustomer", authMiddleware, async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        session.startTransaction();

        const customer = await customerService.deleteCustomer(userId, session);
        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
            data: customer,
        });

    } catch (err) {
        await session.abortTransaction();
        if (err instanceof Error)
            res.status(500).json({ message: err.message })
    } finally {
        await session.endSession();
    }
}
);