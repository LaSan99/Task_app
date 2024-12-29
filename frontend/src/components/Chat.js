import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [roomId, setRoomId] = useState("general");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Join default room
    socket.emit("join_room", roomId);

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => {
        const exists = prev.some((msg) => msg._id === data._id);
        if (exists) return prev;
        return [...prev, data];
      });
    });

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      console.error("User not authenticated");
      window.location.href = "/login";
      return;
    }

    if (messageInput.trim()) {
      const messageData = {
        content: messageInput.trim(),
        roomId,
        timestamp: new Date(),
        sender: user._id,
        senderName: user.username,
      };

      try {
        // Save message to database first
        const response = await axios.post(
          "http://localhost:5000/api/messages",
          messageData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Only emit if save was successful
        socket.emit("send_message", response.data);

        setMessageInput("");
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-3xl mx-auto rounded-lg bg-gray-800 border border-gray-700">
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((message, index) => {
          const user = JSON.parse(localStorage.getItem("user"));
          const isCurrentUser = user && message.sender === user._id;

          return (
            <div
              key={message._id || index}
              className={`mb-4 ${isCurrentUser ? "text-right" : "text-left"}`}
            >
              {!isCurrentUser && (
                <div className="text-xs text-gray-400 mb-1">
                  {message.senderName || "Unknown User"}
                </div>
              )}
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  isCurrentUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <p className="break-words">{message.content}</p>
                <small className="text-xs opacity-75 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-gray-700 bg-gray-800"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
