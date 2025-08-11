import { Server } from "socket.io";
import http from "http"
import express from "express"

const app = express()

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
})

// Para obtener el client-id de un user (cuando se mande un mensaje)
const getReceiverSocketId = (receiverId: string) => userSocketMap[receiverId]

// Registro de usuarios conectados (userId -> socketId)
const userSocketMap: Record<string, string> = {}

io.on("connection", socket => {
  console.log("Se conectó un cliente con id:", socket.id);
  
  // Obtengo el id del usuario (en db) que me manda el socket-client
  const userId = socket.handshake.query.userId as string

  console.log("Se conectó un user con id:", userId);

  // Registra al user conectado
  if (userId) userSocketMap[userId] = socket.id

  // avisa a todos los users
  io.emit("getOnlineUsers", Object.keys(userSocketMap))

  // Si ese cliente se desconecta lo saca del registro
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)

    delete userSocketMap[userId]

    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

export { 
  app, 
  io, 
  httpServer, 
  getReceiverSocketId 
}