import { FaRobot, FaUser } from "react-icons/fa";

const ChatHeader = ({ activeSession, toggleMode }) => {
  const hasSession = Boolean(activeSession);

  return (
    <header className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
      <h3 className="font-semibold text-slate-700">
        {hasSession
          ? `Session ${activeSession.sessionId.slice(0, 8)}`
          : "No active conversation"}
      </h3>

      {hasSession && (
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
      )}
    </header>
  );
};

export default ChatHeader;
