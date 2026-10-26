"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = require("./auth/auth.controller");
const customer_controller_1 = require("./customer/customer.controller");
const booking_controller_1 = require("./booking/booking.controller");
const payment_controller_1 = require("./payment/payment.controller");
const servant_controller_1 = require("./servant/servant.controller");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cose_1 = __importDefault(require("./config/cose"));
const Booking_Socket_1 = __importDefault(require("./socket/Booking.Socket"));
const ENV = `${process.env.MONGO_URL}/${process.env.DB}`;
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, { cors: cose_1.default });
(0, Booking_Socket_1.default)(io);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(cose_1.default));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use("/auth", auth_controller_1.authControlller);
app.use("/servant", servant_controller_1.servantController);
app.use("/customer", customer_controller_1.customerController);
app.use("/booking", booking_controller_1.bookingController);
app.use("/payment", payment_controller_1.paymentController);
app.get("/", (req, res) => {
    res.status(200).json({ message: "api is working" });
});
server.listen(process.env.PORT, () => {
    try {
        console.log(`Server is Running on Port ${process.env.PORT}`);
        mongoose_1.default.connect(ENV);
        console.log("✅ Database connected");
    }
    catch (err) {
        if (err instanceof Error)
            console.log("❌ Connections Error - ", err.message);
    }
});
process.on("SIGINT", async () => {
    console.log("Shutdown");
    await mongoose_1.default.disconnect();
    process.exit(0);
});
