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

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})