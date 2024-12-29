const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const messageRoutes = require("./routes/messages");
const Message = require("./models/Message");
const { cleanup } = require("./utils/whatsappNotifier");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", async (messageData) => {
    try {
      // Save message to database
      const message = new Message({
        content: messageData.content,
        sender: messageData.sender,
        roomId: messageData.roomId,
        timestamp: messageData.timestamp,
      });
      await message.save();

      // Broadcast to room
      io.to(messageData.roomId).emit("receive_message", {
        ...messageData,
        _id: message._id,
      });
    } catch (error) {
      console.error("Error saving/sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle cleanup on server shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Cleaning up...");
  await cleanup();
  httpServer.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Cleaning up...");
  await cleanup();
  httpServer.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
