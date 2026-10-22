
import jwt from "jsonwebtoken";
import type { Server, Socket } from "socket.io";
import cookie from "cookie";
import type { authSingupInterface } from "../auth/auth.interface";

let io: Server | undefined;

const BookingSocket = (server: Server) => {
    io = server;
    io.use((socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || "");

            const token = socket.handshake.auth?.token || cookies.accessToken;

            if (!token)
                return next(new Error("Unauthorized"));

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as authSingupInterface;

            if (!decoded.id)
                return next(new Error("Invalid user in token"));

            socket.data.userId = String(decoded.id);
            next();
        } catch {
            next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId as string;
        socket.join(`user:${userId}`);
        console.log(`Booking socket connected: ${userId}`);
        socket.on("disconnect", () => {
            console.log(`Booking socket disconnected: ${userId}`);
        });
    });
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }

    return io;
};

export default BookingSocket;
