import { Response } from "express"
import jwt from "jsonwebtoken"

const generateToken = (id: string, res: Response) => {

  const token = jwt.sign({ userId: id }, process.env.SECRET as string, { expiresIn: "24h" })


  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,                 // Para que js no pueda acceder a la cookie (previene XSS)
    sameSite: "strict",             // Previene ataques CSRF
    secure: process.env.NODE_ENV !== "development"
  })

  return token
}

export default generateToken