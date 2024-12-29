const express = require("express");
const router = express.Router();
const { sendWhatsAppMessage } = require("../controllers/taskController");
const auth = require("../middleware/auth");

// Add auth middleware to protect the route
router.post("/send-whatsapp", auth, sendWhatsAppMessage);

module.exports = router;
