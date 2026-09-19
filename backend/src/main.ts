import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.DB!)
.then(() => console.log("DB Connected Successfully!"))
.catch(() => console.log("DB Disconnected!"))

import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))

app.get("/", (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Rnode</title>

<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  background:linear-gradient(135deg,#0f172a,#1e293b);
  font-family:Arial,sans-serif;
  color:white;
}

h1{
  font-size:70px;
  color:#38bdf8;
  margin-bottom:15px;
  text-shadow:0 0 20px rgba(56,189,248,0.7);
}

a{
  font-size:24px;
  color:#facc15;
  text-decoration:none;
  padding:10px 20px;
  border:2px solid #facc15;
  border-radius:10px;
  transition:0.3s;
}

a:hover{
  background:#facc15;
  color:#000;
}
</style>
</head>

<body>
  <h1>🚀 Rnode</h1>
  <a>Developed By : Er Ravi</a>
</body>
</html>
`)
})

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on Port ${process.env.PORT}`)
})