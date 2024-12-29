const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// Get messages for a room
router.get("/:roomId", auth, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: 1 })
      .populate("sender", "username")
      .lean();

    // Transform messages to include sender username
    const formattedMessages = messages.map((message) => ({
      _id: message._id,
      content: message.content,
      sender: message.sender._id,
      senderName: message.sender.username,
      roomId: message.roomId,
      timestamp: message.timestamp,
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save a new message
router.post("/", auth, async (req, res) => {
  try {
    const message = new Message({
      content: req.body.content,
      sender: req.user._id,
      roomId: req.body.roomId,
      timestamp: req.body.timestamp,
    });

    await message.save();
    await message.populate("sender", "username");

    res.status(201).json({
      _id: message._id,
      content: message.content,
      sender: message.sender._id,
      senderName: message.sender.username,
      roomId: message.roomId,
      timestamp: message.timestamp,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
