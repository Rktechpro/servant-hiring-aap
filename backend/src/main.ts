import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.DB!)
  .then(() => console.log("DB Connected Successfully!"))
  .catch(() => console.log("DB Disconnected!"))

import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authControlller } from './auth/auth.controller'
import { storeController } from './store/store.controller'
import { servantController } from './servant/servant.controller'
import { customerController } from './customer/customer.controller'
import { bookingController } from './booking/booking.controller'
import { paymentController } from './payment/payment.controller'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.use("/auth", authControlller)
app.use("/storage", storeController)
app.use("/servant", servantController)
app.use("/customer", customerController)
app.use("/booking", bookingController)
app.use("/payment", paymentController)

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on Port ${process.env.PORT}`)
})