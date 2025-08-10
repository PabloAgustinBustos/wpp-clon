import { Request, Response } from "express"
import prisma from "../db/prisma"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import generateToken from "../utils/generateToken"

export const getMe = async(req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    if (!user) return res.status(404).json({ error: "user not found" })
    
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        gender: user.gender,
        profilePicture: user.profilePicture
      }
    })
  } catch(e) {

  }
}

export const signup = async(req: Request, res: Response) => {
  try {
    const { fullname, username, password, confirmPassword, gender } = req.body

    console.log(req.body)

    if (!fullname || !username || !password || !confirmPassword || !gender) return res.status(400).json({
      error: "Please fill in all fields"
    })

    if (password !== confirmPassword) return res.status(400).json({
      error: "passwords don't match"
    })

    const user = await prisma.user.findUnique({ 
      where: { username }
    })

    if (user) return res.status(400).json({
      error: "username already exists"
    })
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

    const newUser = await prisma.user.create({
      data: {
        username,
        fullname,
        password: hashedPassword,
        gender,
        profilePicture: gender == "male" ? boyProfilePic : girlProfilePic
      }
    })

    if (newUser) {
      generateToken(newUser.id, res)
     
      return res.status(201).json({
        newUser: {
          id: newUser.id,
          username: newUser.username,
          fullname: newUser.fullname,
          gender: newUser.gender,
          profilePicture: newUser.profilePicture
        }
      })
    } else {
      return res.status(400).json({ error: "Invalid user data" })
    }
  } catch (e) {
    res.status(500).json({
      error: "internal server error"
    })
  }
}

export const login = async(req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) return res.status(400).json({
      error: "wrong username"
    })

    const isPasswordCorrect = await bcrypt.compare(password, user.password as string)

    if (!isPasswordCorrect) return res.status(400).json({
      error: "wrong password"
    })

    generateToken(user.id, res)

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        gender: user.gender,
        profilePicture: user.profilePicture
      }
    })
  } catch (e) {
    res.status(500).json({
      error: "internal server error"
    })
  }
}

export const logout = async(req: Request, res: Response) => {
  try {
    res.cookie("token", "", { maxAge: 0 })
    res.status(200).json({ message: "logged out" })
  } catch(e) {
    res.status(500).json({ error: "internal server error" })
  }
}