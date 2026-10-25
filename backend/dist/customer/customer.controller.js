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
exports.customerController = void 0;
const express_1 = require("express");
const auth_middelware_1 = require("../auth/auth.middelware");
const customerService = __importStar(require("./customer.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const customer_upload_1 = require("./customer.upload");
exports.customerController = (0, express_1.Router)();
exports.customerController.post("/createCustomer", auth_middelware_1.authMiddleware, async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        const userId = req.user?.id;
        const body = req.body;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const customerData = await customerService.createCustomer(userId, body, session);
        await session.commitTransaction();
        res.status(200).json({ message: "Create Customer Profile SuccessFull ", data: customerData });
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
exports.customerController.get("/", auth_middelware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const getData = await customerService.getCustomer(userId);
        res.status(200).json({ message: "Customer get Data Success! ", data: getData });
    }
    catch (err) {
        if (err instanceof Error)
            res.status(500).json({ message: err.message });
    }
});
exports.customerController.put("/updateCustomer", auth_middelware_1.authMiddleware, async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        const userId = req.user?.id;
        const body = req.body;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const updateCustomers = await customerService.updateCustomer(userId, body, session);
        await session.commitTransaction();
        res.status(200).json({ message: "Customer Update Success! ", data: updateCustomers });
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
exports.customerController.delete("/deleteCustomer", auth_middelware_1.authMiddleware, async (req, res) => {
    const session = await mongoose_1.default.startSession();
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
// customerController.put("/updateImageProfile", authMiddleware, async (req: AuthRequest, res: Response) => {
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
//         const customer = await customerService.updateImageProfile(userId, path);
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
exports.customerController.put("/updateImageProfile", auth_middelware_1.authMiddleware, customer_upload_1.uploadCustomerImage.single("image"), async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        const userId = req.user?.id;
        const file = req.file;
        session.startTransaction();
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!file)
            return res.status(400).json({ message: "No image file provided" });
        const customer = await customerService.updateImageProfile(userId, file, session);
        await session.commitTransaction();
        return res.status(200).json({
            message: "Customer image updated successfully",
            data: customer,
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
