import express from "express"

const messageRouter = express.Router()

messageRouter.get("/conversations", (req, res) => {
  res.send("conversation")
})

export default messageRouter