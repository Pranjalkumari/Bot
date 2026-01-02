import React, { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { v4 as uuidv4 } from 'uuid';
import { FaPaperPlane, FaComments, FaTimes } from 'react-icons/fa';
import "../App.css"

const ChatPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Session Management
    let sessionId = localStorage.getItem("chatSessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("chatSessionId", sessionId);
    }

    socket.emit("join_session", sessionId);

    socket.on("history_data", (history) => setMessages(history));
    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("history_data");
      socket.off("new_message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const sessionId = localStorage.getItem("chatSessionId");
    socket.emit("send_message", { sessionId, text: input, sender: 'user' });
    setInput("");
  };

  return (
    <div className="font-sans">
      {/* Floating Button */}
     <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
  {isOpen ? <FaTimes size={22} /> : <FaComments size={22} />}
</button>


      {/* Chat Window */}
      {isOpen && (
  <div className="chat-window">
    <div className="chat-header">Support Chat</div>

    <div className="chat-messages">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message ${
            msg.sender === "user"
              ? "user"
              : msg.sender === "system"
              ? "system"
              : "bot"
          }`}
        >
          {msg.text}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>


    <div className="chat-input">
      <input
        placeholder="Type a message…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend}>
        <FaPaperPlane />
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ChatPage;