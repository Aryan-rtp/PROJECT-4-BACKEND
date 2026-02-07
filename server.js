require("dotenv").config()
const app = require("./src/app")
const { createServer } = require("http")
const { Server } = require("socket.io")
const airesponse = require("./src/services/ai.service")

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://project-4-frontend-five.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

const chatHistory = []

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })

  socket.on("ai-message", async (data) => {
    try {
      chatHistory.push({
        role: "user",
        parts: [{ text: data }],
      })

      const response = await airesponse(chatHistory)
      chatHistory.push({
        role: "model",
        parts: [{ text: response }],
      })

      socket.emit("ai-response", { response })
    } catch (error) {
      console.error("Error processing message:", error)
      socket.emit("ai-response", {
        response:
          "Sorry, I encountered an error. Please try again later.",
      })
    }
  })
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
})
