import express from "express"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config()

import authRoutes from "./routes/auth.routes"
import messageRoutes from "./routes/message.routes"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.listen(3001, () => {
  console.log("listening on 3001")
})