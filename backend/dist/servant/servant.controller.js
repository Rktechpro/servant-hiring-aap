import { Router } from "express";
import * as servantService from './servant.service';
import { authMiddleware } from "../auth/auth.middelware";
import { createServantSchema } from "./servant.dto";
import mongoose from "mongoose";
import { uploadServantImage } from "./servant.upload";
import { searchServants } from "../Embedding/servantSearch.service";
import { updateAllServantEmbeddings } from "../Embedding/servantEmbedding.service";
export const servantController = Router();
servantController.post("/createServant", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user?.id;
        const body = req.body;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        // const data = createServantSchema.parse(body)
        const servant = await servantService.createServant(userId, body, session);
        await session.commitTransaction();
        res.status(200).json({ message: "Servant Data Create SuccessFull!", data: servant });
    }
    catch (err) {
        await session.abortTransaction();
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
    finally {
        await session.endSession();
    }
});
servantController.get("/", authMiddleware, async (req, res) => {
    try {
        const servant = await servantService.getServant();
        res.status(200).json({ message: "Customer get Data Success! ", data: servant });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
servantController.put("/updateServant", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user?.id;
        const body = req.body;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const data = createServantSchema.parse(body);
        const updateServantData = await servantService.updateDataServant(userId, data, session);
        await session.commitTransaction();
        res.status(200).json({
            message: "Servant profile updated successfully",
            data: updateServantData
        });
    }
    catch (err) {
        await session.abortTransaction();
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
    finally {
        await session.endSession();
    }
});
servantController.delete("/deleteServant", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user?.id;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const deleteServantData = await servantService.deleteDataServant(userId, session);
        await session.commitTransaction();
        res.status(200).json({
            message: "Servant profile delete successfully",
            data: deleteServantData
        });
    }
    catch (err) {
        await session.abortTransaction();
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
    finally {
        await session.endSession();
    }
});
// servantController.put("/ImageServantProfile", authMiddleware, async (req: AuthRequest, res: Response) => {
//     const session = await mongoose.startSession();
//     try {
//         const userId = req.user?.id;
//         const path = req.body?.path;
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//             });
//         }
//         session.startTransaction();
//         const customer = await servantService.ServantImageProfile(userId, path);
//         await session.commitTransaction();
//         return res.status(200).json({
//             success: true,
//             message: "Customer image updated successfully",
//             data: customer,
//         });
//     } catch (err) {
//         await session.abortTransaction();
//         if (err instanceof Error)
//             res.status(500).json({ message: err.message })
//     } finally {
//         await session.endSession();
//     }
// }
// );
servantController.put("/imageServantProfile", authMiddleware, uploadServantImage.single("image"), async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user?.id;
        const file = req.file;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!file)
            return res.status(400).json({ message: "No image file provided" });
        const servants = await servantService.ServantImageProfile(userId, file, session);
        await session.commitTransaction();
        return res.status(200).json({
            message: "Servant Profile Image Updated!",
            data: servants
        });
    }
    catch (err) {
        await session.abortTransaction();
        if (err instanceof Error)
            res.status(500).json({ message: err.message });
    }
    finally {
        await session.endSession();
    }
});
servantController.get("/semantic-search", async (req, res) => {
    try {
        const q = String(req.query.q || "").trim();
        const location = String(req.query.location || "").trim();
        const maxPriceRaw = req.query.maxPrice;
        const availableRaw = req.query.available;
        if (q.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Search query is too long",
            });
        }
        if (maxPriceRaw !== undefined &&
            (!Number.isFinite(Number(maxPriceRaw)) ||
                Number(maxPriceRaw) < 0)) {
            return res.status(400).json({
                success: false,
                message: "maxPrice must be a non-negative number",
            });
        }
        let available;
        if (availableRaw === "true")
            available = true;
        if (availableRaw === "false")
            available = false;
        const data = await searchServants({
            q,
            location: location || undefined,
            maxPrice: maxPriceRaw !== undefined
                ? Number(maxPriceRaw)
                : undefined,
            available,
            limit: Number(req.query.limit) || 20,
        });
        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    }
    catch (error) {
        console.error("Semantic servant search failed:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to search servants right now",
        });
    }
});
servantController.post("/generate-embeddings", async (_req, res) => {
    try {
        const result = await updateAllServantEmbeddings();
        return res.status(200).json({
            success: true,
            message: "Servant embeddings generated",
            data: result,
        });
    }
    catch (error) {
        console.error("Generate embeddings failed:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to generate servant embeddings",
        });
    }
});
