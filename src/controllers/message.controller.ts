import { Request, Response } from "express";
import prisma from "../db/prisma";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async(req: Request, res: Response) => {
  console.log("sendMessage")

  try {
    const { id: receiverID } = req.params
    const { message } = req.body

    const senderID = req.user.id

    console.log(`sender: ${senderID}\nreceiver: ${receiverID}`)

    // busca a ver si ya hay una conversación
    let conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: { hasEvery: [senderID, receiverID] }
      }
    })

    // Si no lo hay, lo crea
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantsIds: {
            set: [senderID, receiverID]
          }
        }
      })
    }

    // Crea el mensaje a mandar
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderID,
        body: message,
        conversationId: conversation.id
      }
    })

    if (newMessage) {
      // Agrega el mensaje a la conversación
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id
        },

        data: {
          messages: {
            connect: {
              id: newMessage.id,
            }
          }
        }
      })
    }

    // Obtiene el client id
    const receiverSocketId = getReceiverSocketId(receiverID)

    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage)

    res.status(201).json({ newMessage })
  } catch (e) {
    res.status(500).json({ error: "internal error" })
  }
}

export const getMessage = async(req: Request, res: Response) => {
  try {
    const { id: userToChatID } = req.params   // El otro user
    const senderID = req.user.id              // Yo

    // Obtengo todos los mensajes en orden ascendente
    const conversation = await prisma.conversation.findFirst({
      where: {
        participantsIds: { hasEvery: [senderID, userToChatID] }
      },

      include: {
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    console.log(conversation)

    if (!conversation) {
      return res.status(200).json({
        messages: []
      })
    }

    return res.status(200).json({
      messages: conversation.messages
    })
  } catch (e) {
    res.status(500).json({ error: "internal error" })
  }
}

export const getConversations = async(req: Request, res: Response) => {
  try {
    const authUserID = req.user.id

    // Busca a todos los users registrados
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserID
        }
      },

      select: {
        id: true,
        fullname: true,
        profilePicture: true
      }
    })

    res.status(200).json({ users })
  } catch (e) {
    res.status(500).json({ error: "internal error" })
  }
}