import React, { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { FaRobot, FaUser, FaChartBar, FaList } from 'react-icons/fa';

const AnalyticsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [adminInput, setAdminInput] = useState("");
  const [stats, setStats] = useState({ totalSessions: 0, activeTickets: 0, totalMessages: 0 });
  const [view, setView] = useState("chat"); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_admin");

    socket.on("admin_all_sessions", (data) => setSessions(data));
    socket.on("session_updated", (updatedSession) => {
      setSessions((prev) => {
        const idx = prev.findIndex(s => s.sessionId === updatedSession.sessionId);
        if (idx > -1) {
          const newArr = [...prev];
          newArr[idx] = updatedSession;
          return newArr.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        }
        return [updatedSession, ...prev];
      });
    });
    socket.on("analytics_update", (data) => setStats(data));

    return () => {
      socket.off("admin_all_sessions");
      socket.off("session_updated");
      socket.off("analytics_update");
    };
  }, []);

  const activeSession = sessions.find(s => s.sessionId === activeSessionId);

  const handleSend = () => {
    if (!adminInput.trim() || !activeSessionId) return;
    socket.emit("send_message", { sessionId: activeSessionId, text: adminInput, sender: 'agent' });
    setAdminInput("");
  };

  const toggleMode = () => {
    if (!activeSession) return;
    const newMode = activeSession.mode === 'bot' ? 'human' : 'bot';
    socket.emit("toggle_mode", { sessionId: activeSessionId, mode: newMode });
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeSession]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-700">Dashboard</h2>
          <div className="flex gap-2">
            <button onClick={() => setView('chat')} className={`p-2 rounded ${view==='chat' ? 'bg-blue-100 text-blue-600':''}`}><FaList/></button>
            <button onClick={() => setView('analytics')} className={`p-2 rounded ${view==='analytics' ? 'bg-blue-100 text-blue-600':''}`}><FaChartBar/></button>
          </div>
        </div>

        {view === 'chat' ? (
          <div className="overflow-y-auto flex-1">
            {sessions.map(session => (
              <div 
                key={session.sessionId}
                onClick={() => setActiveSessionId(session.sessionId)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeSessionId === session.sessionId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-xs text-gray-500">{session.sessionId.slice(0, 8)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${session.mode === 'bot' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {session.mode.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm truncate text-gray-700">
                  {session.messages[session.messages.length - 1]?.text || "Empty"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-white p-4 rounded shadow border border-blue-100">
              <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
              <div className="text-xs text-gray-500 uppercase">Total Chats</div>
            </div>
            <div className="bg-white p-4 rounded shadow border border-red-100">
              <div className="text-3xl font-bold text-red-600">{stats.activeTickets}</div>
              <div className="text-xs text-gray-500 uppercase">Need Human</div>
            </div>
            <div className="bg-white p-4 rounded shadow border border-green-100">
              <div className="text-3xl font-bold text-green-600">{stats.totalMessages}</div>
              <div className="text-xs text-gray-500 uppercase">Total Messages</div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {view === 'chat' && activeSession ? (
          <>
            <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
              <span className="font-bold">Chatting with {activeSession.sessionId.slice(0,8)}</span>
              <button 
                onClick={toggleMode}
                className={`px-4 py-2 rounded text-sm font-bold text-white flex items-center gap-2 ${activeSession.mode === 'bot' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {activeSession.mode === 'bot' ? <><FaRobot/> Bot Active</> : <><FaUser/> Agent Active</>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
              {activeSession.messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm max-w-[70%] shadow-sm ${
                  msg.sender === 'agent' ? 'bg-blue-600 text-white self-end' :
                  msg.sender === 'user' ? 'bg-white border text-gray-800 self-start' :
                  'bg-gray-200 text-gray-600 self-start text-xs'
                }`}>
                  <div className="font-bold text-[10px] opacity-70 mb-1 uppercase">{msg.sender}</div>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input 
                className="flex-1 border p-3 rounded outline-none"
                placeholder={activeSession.mode === 'bot' ? "Switch to Agent Mode to reply..." : "Type your reply..."}
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={activeSession.mode === 'bot'}
              />
              <button onClick={handleSend} disabled={activeSession.mode === 'bot'} className="bg-blue-600 text-white px-6 rounded disabled:opacity-50">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {view === 'chat' ? "Select a conversation to start" : "Analytics View"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;