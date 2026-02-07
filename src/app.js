const express = require("express")
const cors = require("cors")
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("AI Chat API Server is running")
})

module.exports = app