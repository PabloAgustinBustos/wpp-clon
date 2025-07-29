import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import prisma from "../db/prisma"

interface DecodedToken extends JwtPayload {
  userId: string 
}

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string
      }
    }
  }
}

// Verifica el token y verifica que el usuario exista
const protectRoute = async(req: Request, res: Response, next: NextFunction) => {
  console.log("protectRoute")
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: "unauthorized - no token provided" })
    }

    const decoded = jwt.verify(token, process.env.SECRET as string) as DecodedToken

    if (!decoded) {
      return res.status(401).json({ error: "unauthorized - no token provided" })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        fullname: true,
        profilePicture: true
      }
    })

    if (!user) return res.status(404).json({ error: "user not found" })

    req.user = user

    next()
  } catch(e) {
    return res.status(500).json({ error: "internal error" })
  }
}

export default protectRoute