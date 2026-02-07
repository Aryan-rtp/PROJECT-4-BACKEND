require("dotenv").config()
const app = require("./src/app")
const { createServer } = require("http")
const { Server } = require("socket.io")
const airesponse = require("./src/services/ai.service")

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["https://project-4-frontend-five.vercel.app/"],
    methods: ["GET", "POST"],
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

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000")
})