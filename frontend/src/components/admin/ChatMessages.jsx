const ChatMessages = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-3">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`max-w-[70%] p-3 rounded-xl text-sm ${
            m.sender === "agent"
              ? "ml-auto bg-indigo-600 text-white"
              : "bg-white border"
          }`}
        >
          <div className="text-[10px] font-bold uppercase mb-1">
            {m.sender}
          </div>
          {m.text}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
