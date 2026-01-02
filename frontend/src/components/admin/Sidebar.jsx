import { FaChartBar, FaList } from "react-icons/fa";
import SessionList from "./SessionList";
import StatsPanel from "./StatsPanel";

const Sidebar = ({
  view,
  setView,
  sessions,
  activeSessionId,
  setActiveSessionId,
  stats,
}) => {
  return (
    <aside className="w-80 bg-white border-r shadow-sm flex flex-col">
      <div className="p-5 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>

      <div className="flex gap-2 p-4 border-b">
        <button
          onClick={() => setView("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${
            view === "chat"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <FaList /> Chats
        </button>

        <button
          onClick={() => setView("analytics")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${
            view === "analytics"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <FaChartBar /> Stats
        </button>
      </div>

      {view === "chat" ? (
        <SessionList
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
        />
      ) : (
        <StatsPanel stats={stats} />
      )}
    </aside>
  );
};

export default Sidebar;
