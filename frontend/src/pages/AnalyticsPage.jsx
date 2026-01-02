import React, { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { FaRobot, FaUser, FaChartBar, FaList } from "react-icons/fa";

const AnalyticsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [adminInput, setAdminInput] = useState("");
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeTickets: 0,
    totalMessages: 0,
  });
  const [view, setView] = useState("chat");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_admin");

    socket.on("admin_all_sessions", setSessions);
    socket.on("session_updated", (updatedSession) => {
      setSessions((prev) => {
        const idx = prev.findIndex(
          (s) => s.sessionId === updatedSession.sessionId
        );
        if (idx > -1) {
          const arr = [...prev];
          arr[idx] = updatedSession;
          return arr.sort(
            (a, b) => new Date(b.lastActive) - new Date(a.lastActive)
          );
        }
        return [updatedSession, ...prev];
      });
    });

    socket.on("analytics_update", setStats);

    return () => {
      socket.off("admin_all_sessions");
      socket.off("session_updated");
      socket.off("analytics_update");
    };
  }, []);

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

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r shadow-sm flex flex-col">
        <div className="p-5 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>

        <div className="flex gap-2 p-4 border-b">
          <button
            onClick={() => setView("chat")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
              view === "chat"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FaList /> Chats
          </button>

          <button
            onClick={() => setView("analytics")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
              view === "analytics"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FaChartBar /> Stats
          </button>
        </div>

        {/* SESSION LIST */}
        {view === "chat" ? (
          <div className="flex-1 overflow-y-auto">
            {sessions.map((s) => (
              <div
                key={s.sessionId}
                onClick={() => setActiveSessionId(s.sessionId)}
                className={`p-4 cursor-pointer border-b transition ${
                  activeSessionId === s.sessionId
                    ? "bg-indigo-50 border-l-4 border-indigo-600"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500">
                    {s.sessionId.slice(0, 8)}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      s.mode === "bot"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {s.mode.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-slate-700 truncate">
                  {s.messages.at(-1)?.text || "No messages"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {[
              ["Total Chats", stats.totalSessions, "indigo"],
              ["Need Human", stats.activeTickets, "rose"],
              ["Messages", stats.totalMessages, "emerald"],
            ].map(([label, value, color]) => (
              <div
                key={label}
                className="bg-white p-5 rounded-xl shadow border"
              >
                <div className={`text-3xl font-bold text-${color}-600`}>
                  {value}
                </div>
                <div className="text-xs uppercase text-slate-500 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col">
        {view === "chat" && activeSession ? (
          <>
            <header className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
              <h3 className="font-semibold">
                Session {activeSession.sessionId.slice(0, 8)}
              </h3>

              <button
                onClick={toggleMode}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition ${
                  activeSession.mode === "bot"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-rose-500 hover:bg-rose-600"
                }`}
              >
                {activeSession.mode === "bot" ? (
                  <>
                    <FaRobot /> Bot Active
                  </>
                ) : (
                  <>
                    <FaUser /> Agent Active
                  </>
                )}
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-3">
              {activeSession.messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-3 rounded-xl shadow-sm text-sm ${
                    m.sender === "agent"
                      ? "ml-auto bg-indigo-600 text-white"
                      : m.sender === "user"
                      ? "bg-white border text-slate-800"
                      : "bg-slate-200 text-slate-600 text-xs"
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-70 uppercase mb-1">
                    {m.sender}
                  </div>
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 bg-white border-t flex gap-2">
              <input
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={
                  activeSession.mode === "bot"
                    ? "Switch to Agent mode to reply"
                    : "Type your reply..."
                }
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={activeSession.mode === "bot"}
              />
              <button
                onClick={handleSend}
                disabled={activeSession.mode === "bot"}
                className="px-6 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-40"
              >
                Send
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-lg">
            Select a conversation to start
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;
