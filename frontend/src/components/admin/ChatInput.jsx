const ChatInput = ({ adminInput, setAdminInput, handleSend, disabled }) => {
  return (
    <footer className="p-4 bg-white border-t flex gap-2">
      <input
        className="flex-1 px-4 py-3 border rounded-lg"
        value={adminInput}
        onChange={(e) => setAdminInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled}
        placeholder="Type your reply..."
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="px-6 bg-indigo-600 text-white rounded-lg disabled:opacity-40"
      >
        Send
      </button>
    </footer>
  );
};

export default ChatInput;
