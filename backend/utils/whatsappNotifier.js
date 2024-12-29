const wbm = require("wbm");

const sendWhatsAppNotification = async (to, taskDetails) => {
  try {
    // Start the session with specific browser config
    await wbm.start({
      showBrowser: true,
      qrCodeData: true,
      session: true,
      puppeteerOptions: {
        headless: false,
        userDataDir: "./whatsapp-session",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-notifications",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--disable-dev-shm-usage",
        ],
      },
    });

    // Wait for QR Code scanning
    await wbm.waitQRCode();

    // Format Sri Lankan phone number
    let formattedNumber = to;

    // Remove all spaces, dashes, and other special characters
    formattedNumber = formattedNumber.replace(/[\s\-\(\)\+]/g, "");

    // If starts with 0, replace with 94
    if (formattedNumber.startsWith("0")) {
      formattedNumber = "94" + formattedNumber.substring(1);
    }

    // If doesn't start with 94, add it
    if (!formattedNumber.startsWith("94")) {
      formattedNumber = "94" + formattedNumber;
    }

    // Add spaces as per WhatsApp format
    formattedNumber = formattedNumber.replace(
      /(\d{2})(\d{2})(\d{3})(\d{4})/,
      "$1 $2 $3 $4"
    );

    console.log("Original number:", to);
    console.log("Formatted number:", formattedNumber);

    const message = `
*Task Details*
📌 *Title:* ${taskDetails.title}
📝 *Description:* ${taskDetails.description}
✅ *Status:* ${taskDetails.completed ? "Completed" : "Pending"}
⏰ *Created:* ${new Date().toLocaleString()}`;

    // Send message
    console.log(`Attempting to send message to: ${formattedNumber}`);
    await wbm.send([formattedNumber], message);

    // Don't close the session, just end the current operation
    await wbm.end();
  } catch (error) {
    console.error("Detailed error:", error);
    try {
      await wbm.end();
    } catch (endError) {
      console.error("Error ending WhatsApp session:", endError);
    }
    throw error;
  }
};

// Add a cleanup function to properly close browser when needed
const cleanup = async () => {
  try {
    await wbm.end();
    console.log("WhatsApp session cleaned up");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

module.exports = { sendWhatsAppNotification, cleanup };
