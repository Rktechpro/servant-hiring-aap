import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authControlller } from './auth/auth.controller'
import { storeController } from './store/store.controller'
import { customerController } from './customer/customer.controller'
import { bookingController } from './booking/booking.controller'
import { paymentController } from './payment/payment.controller'
import { servantController } from './servant/servant.controller'
import { createServer } from 'http'
import { Server } from 'socket.io'
import CorsConfig from './config/cose'
import BookingSocket from './socket/Booking.Socket'


const app = express()
const server = createServer(app)

const io = new Server(server, { cors: CorsConfig })

BookingSocket(io)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors(CorsConfig))


app.use("/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/auth", authControlller)
app.use("/storage", storeController)
app.use("/servant", servantController)
app.use("/customer", customerController)
app.use("/booking", bookingController)
app.use("/payment", paymentController)



server.listen(process.env.PORT, () => {
  try {
    console.log(`Server is Running on Port ${process.env.PORT}`)
    mongoose.connect(process.env.DB!)
    console.log("✅ Database connected")
  } catch (err) {
    if (err instanceof Error)
      console.log("❌ Connections Error - ", err.message)
  }
})

process.on("SIGINT", async () => {
  console.log("Shutdown")
  await mongoose.disconnect()
  process.exit(0)
})