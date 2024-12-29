const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");
const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount the routes
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
