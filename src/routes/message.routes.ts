import express from "express"
import protectRoute from "../middleware/protectRoute"
import { getMessage, sendMessage, getConversations } from "../controllers/message.controller"

const messageRouter = express.Router()

messageRouter.get("/conversations", protectRoute, getConversations)
messageRouter.get("/:id", protectRoute, getMessage)
messageRouter.post("/send/:id", protectRoute, sendMessage)

export default messageRouter