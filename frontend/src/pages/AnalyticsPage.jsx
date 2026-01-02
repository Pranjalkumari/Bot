import React, { useEffect, useRef, useState } from "react";
import socket from "../services/socket";

import Sidebar from "../components/admin/Sidebar";
import ChatHeader from "../components/admin/ChatHeader";
import ChatMessages from "../components/admin/ChatMessages";
import ChatInput from "../components/admin/ChatInput";
import EmptyState from "../components/admin/EmptyState";

const AnalyticsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [adminInput, setAdminInput] = useState("");
  const [view, setView] = useState("chat");

  const [stats, setStats] = useState({
    totalSessions: 0,
    activeTickets: 0,
    totalMessages: 0,
  });

  const messagesEndRef = useRef(null);

  /* ---------------- SOCKET LOGIC ---------------- */
  useEffect(() => {
    socket.emit("join_admin");

    socket.on("admin_all_sessions", setSessions);
    socket.on("analytics_update", setStats);

    socket.on("session_updated", (updatedSession) => {
      setSessions((prev) => {
        const idx = prev.findIndex(
          (s) => s.sessionId === updatedSession.sessionId
        );

        if (idx > -1) {
          const copy = [...prev];
          copy[idx] = updatedSession;
          return copy.sort(
            (a, b) => new Date(b.lastActive) - new Date(a.lastActive)
          );
        }

        return [updatedSession, ...prev];
      });
    });

    return () => {
      socket.off("admin_all_sessions");
      socket.off("analytics_update");
      socket.off("session_updated");
    };
  }, []);

  /* ---------------- HELPERS ---------------- */
  const activeSession = sessions.find(
    (s) => s.sessionId === activeSessionId
  );

  const handleSend = () => {
    if (!adminInput.trim() || !activeSessionId) return;

    socket.emit("send_message", {
      sessionId: activeSessionId,
      text: adminInput,
      sender: "agent",
    });

    setAdminInput("");
  };

  const toggleMode = () => {
    if (!activeSession) return;

    socket.emit("toggle_mode", {
      sessionId: activeSessionId,
      mode: activeSession.mode === "bot" ? "human" : "bot",
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession]);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        view={view}
        setView={setView}
        sessions={sessions}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        stats={stats}
      />
<main className="flex-1 flex flex-col bg-slate-50">
  {activeSession ? (
    <>
      {/* HEADER */}
      <ChatHeader
        activeSession={activeSession}
        toggleMode={toggleMode}
      />

      {/* MESSAGES */}
      <ChatMessages
        messages={activeSession.messages}
        messagesEndRef={messagesEndRef}
      />

      {/* INPUT */}
      <ChatInput
        adminInput={adminInput}
        setAdminInput={setAdminInput}
        handleSend={handleSend}
        disabled={activeSession.mode === "bot"}
      />
    </>
  ) : (
    <EmptyState />
  )}
</main>


    </div>
  );
};

export default AnalyticsPage;
