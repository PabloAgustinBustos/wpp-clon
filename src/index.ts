import express from "express"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
dotenv.config()

import authRoutes from "./routes/auth.routes"
import messageRoutes from "./routes/message.routes"

import { app, httpServer } from "./socket/socket"

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

const PORT = process.env.PORT

httpServer.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})