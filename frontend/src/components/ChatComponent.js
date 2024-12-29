import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    // Join the general room when component mounts
    socket.emit("join_room", "general");

    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Load existing messages
    socket.emit("get_messages", "general", (response) => {
      if (response.messages) {
        setMessages(response.messages);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
      socket.emit("leave_room", "general");
    };
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    try {
      socket.emit("send_message", {
        room: "general",
        content: currentMessage,
        timestamp: new Date().toISOString(),
      });

      setCurrentMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-3xl mx-auto rounded-lg bg-gray-800 border border-gray-700">
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((message, index) => (
          <div key={message._id || index} className="mb-4">
            <div className="inline-block p-3 rounded-lg bg-gray-700 text-gray-100">
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
