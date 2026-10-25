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
exports.authControlller = void 0;
const express_1 = require("express");
const authService = __importStar(require("./auth.service"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.authControlller = (0, express_1.Router)();
exports.authControlller.post("/signup", async (req, res) => {
    const session = await mongoose_1.default.startSession();
    try {
        const body = req.body;
        session.startTransaction();
        const [user] = await authService.authSignup(body, session);
        await session.commitTransaction();
        res.json(user);
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
exports.authControlller.post("/login", async (req, res) => {
    try {
        const body = req.body;
        const userSigIn = await authService.authLogin(body);
        res.cookie("accessToken", userSigIn.accessToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: 'lax'
        });
        res.cookie("refereshToken", userSigIn.refreshToken, {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_REFERSH_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: "lax"
        });
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
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
exports.authControlller.post("/logout", async (req, res) => {
    try {
        const signOut = await authService.logout();
        const cookieOption = {
            httpOnly: true,
            maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
            secure: process.env.NODE_ENV === "dev" ? false : true,
            sameSite: 'lax'
        };
        res.clearCookie("accessToken", cookieOption);
        res.clearCookie("refreshToken", cookieOption);
        res.status(201).json({
            message: signOut.message
        });
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(500).json({ message: err.message });
    }
});
