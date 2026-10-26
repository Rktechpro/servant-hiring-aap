"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const options = {
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_ACCESS_MAX_AGE),
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: "lax"
};
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch (err) {
        res.clearCookie("accessToken", options);
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Access token expired",
            });
        }
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.authMiddleware = authMiddleware;
