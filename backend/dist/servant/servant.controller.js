"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servantController = void 0;
const express_1 = require("express");
const servantService = __importStar(require("./servant.service"));
const auth_middelware_1 = require("../auth/auth.middelware");
const servant_dto_1 = require("./servant.dto");
const mongoose_1 = __importDefault(require("mongoose"));
const servant_upload_1 = require("./servant.upload");
const servantSearch_service_1 = require("../Embedding/servantSearch.service");
const servantEmbedding_service_1 = require("../Embedding/servantEmbedding.service");
exports.servantController = (0, express_1.Router)();
exports.servantController.post("/createServant", auth_middelware_1.authMiddleware, async (req, res) => {
    const session = await mongoose_1.default.startSession();
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
exports.servantController.get("/", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const servant = await servantService.getServant();
        res.status(200).json({ message: "Customer get Data Success! ", data: servant });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
exports.servantController.put("/updateServant", auth_middelware_1.authMiddleware, async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        const userId = req.user?.id;
        const body = req.body;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const data = servant_dto_1.createServantSchema.parse(body);
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
exports.servantController.delete("/deleteServant", auth_middelware_1.authMiddleware, async (req, res) => {
    const session = await mongoose_1.default.startSession();
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
exports.servantController.put("/imageServantProfile", auth_middelware_1.authMiddleware, servant_upload_1.uploadServantImage.single("image"), async (req, res) => {
    const session = await mongoose_1.default.startSession();
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
exports.servantController.get("/semantic-search", async (req, res) => {
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
        const data = await (0, servantSearch_service_1.searchServants)({
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
exports.servantController.post("/generate-embeddings", async (_req, res) => {
    try {
        const result = await (0, servantEmbedding_service_1.updateAllServantEmbeddings)();
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
