"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
let io;
const BookingSocket = (server) => {
    io = server;
    io.use((socket, next) => {
        try {
            const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || "");
            const token = socket.handshake.auth?.token || cookies.accessToken;
            if (!token)
                return next(new Error("Unauthorized"));
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decoded.id)
                return next(new Error("Invalid user in token"));
            socket.data.userId = String(decoded.id);
            next();
        }
        catch {
            next(new Error("Invalid or expired token"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);
        console.log(`Booking socket connected: ${userId}`);
        socket.on("disconnect", () => {
            console.log(`Booking socket disconnected: ${userId}`);
        });
    });
};
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }
    return io;
};
exports.getIO = getIO;
exports.default = BookingSocket;
