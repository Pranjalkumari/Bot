const SessionList = ({ sessions, activeSessionId, setActiveSessionId }) => {
  return (
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
  );
};

export default SessionList;
