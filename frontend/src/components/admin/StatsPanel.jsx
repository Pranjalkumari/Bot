const statColors = {
  indigo: "text-indigo-600",
  rose: "text-rose-600",
  emerald: "text-emerald-600",
};

const StatsPanel = ({ stats }) => {
  return (
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
          <div className={`text-3xl font-bold ${statColors[color]}`}>
            {value}
          </div>
          <div className="text-xs uppercase text-slate-500 mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
