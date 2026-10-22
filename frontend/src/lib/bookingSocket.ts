
import { io } from "socket.io-client";

export const bookingSocket = io(
    import.meta.env.VITE_API_URL || "http://localhost:8080",
    {
        withCredentials: true,
        autoConnect: false,
        transports: ["websocket", "polling"],
    }
);
