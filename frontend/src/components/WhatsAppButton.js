import axios from "axios";

function WhatsAppButton({ task }) {
  const handleSendWhatsApp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/tasks/send-whatsapp",
        { taskId: task._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("WhatsApp message sent successfully!");
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send WhatsApp message";
      alert(errorMessage);
    }
  };

  return (
    <button
      onClick={handleSendWhatsApp}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.76 7.84 19.02L7.55 18.85L4.43 19.65L5.24 16.61L5.05 16.31C4.24 15 3.82 13.47 3.82 11.91C3.82 7.37 7.49 3.7 12.03 3.7C14.23 3.7 16.28 4.56 17.85 6.13C19.42 7.7 20.28 9.75 20.28 11.95C20.28 16.47 16.61 20.15 12.05 20.15Z" />
      </svg>
      Send WhatsApp
    </button>
  );
}

export default WhatsAppButton;
