import express from "express"
import { login, logout, signup, getMe } from "../controllers/auth.controller"
import protectRoute from "../middleware/protectRoute"

const authRouter = express.Router()

authRouter.get("/me", protectRoute, getMe)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/signup", signup)

export default authRouter