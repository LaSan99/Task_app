const Task = require("../models/Task");
const { sendWhatsAppNotification } = require("../utils/whatsappNotifier");

// In your createTask controller
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    // Send WhatsApp notification
    // Phone number should be in international format without '+' (e.g., "911234567890")
    await sendWhatsAppNotification(process.env.ADMIN_PHONE_NUMBER, task);

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

// Add this new controller function
const sendWhatsAppMessage = async (req, res) => {
  try {
    const { taskId } = req.body;

    // Get task details
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Get phone number from env and format it
    const phoneNumber = process.env.ADMIN_PHONE_NUMBER;

    console.log("Initiating WhatsApp send to:", phoneNumber);
    await sendWhatsAppNotification(phoneNumber, task);

    res.status(200).json({ message: "WhatsApp message sent successfully" });
  } catch (error) {
    console.error("Error in sendWhatsAppMessage:", error);
    res.status(500).json({
      message: "Error sending WhatsApp message: " + error.message,
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  sendWhatsAppMessage,
  // ... other exports
};
