import Conversation from '../models/Conversation.js';
import { generateAIResponse } from '../services/ai.service.js';

export const handleSocketConnection = (io, socket) => {
  console.log(`User Connected: ${socket.id}`);

  // --- JOIN SESSION ---
  socket.on('join_session', async (sessionId) => {
    socket.join(sessionId);
    let session = await Conversation.findOne({ sessionId });
    
    if (!session) {
      session = new Conversation({ sessionId, messages: [] });
      await session.save();
    }
    
    socket.emit('history_data', session.messages);
    io.to('admin_room').emit('session_updated', session);
  });

  // --- ADMIN JOIN ---
  socket.on('join_admin', async () => {
    socket.join('admin_room');
    const sessions = await Conversation.find({ status: 'active' }).sort({ lastActive: -1 });
    socket.emit('admin_all_sessions', sessions);
    
    // Send initial analytics
    await sendAnalytics(io);
  });

  // --- HANDLE MESSAGES ---
  socket.on('send_message', async ({ sessionId, text, sender }) => {
    const session = await Conversation.findOne({ sessionId });
    if (!session) return;

    // 1. Save User/Agent Message
    const newMessage = { text, sender, timestamp: new Date() };
    session.messages.push(newMessage);
    session.lastActive = new Date();
    await session.save();

    io.to(sessionId).emit('new_message', newMessage);
    io.to('admin_room').emit('session_updated', session);
    await sendAnalytics(io); // Update stats in real-time

    // 2. AI Response Logic
    if (session.mode === 'bot' && sender === 'user') {
      const aiReply = await generateAIResponse(session.messages, text);

      if (aiReply.includes("ESCALATE_TO_HUMAN")) {
        session.mode = 'human';
        const systemMsg = { text: "Connecting you to an agent...", sender: 'system' };
        session.messages.push(systemMsg);
        await session.save();
        io.to(sessionId).emit('new_message', systemMsg);
      } else {
        const botMsg = { text: aiReply, sender: 'ai', timestamp: new Date() };
        session.messages.push(botMsg);
        await session.save();
        io.to(sessionId).emit('new_message', botMsg);
      }
      io.to('admin_room').emit('session_updated', session);
    }
  });

  // --- TOGGLE MODE ---
  socket.on('toggle_mode', async ({ sessionId, mode }) => {
    const session = await Conversation.findOneAndUpdate({ sessionId }, { mode }, { new: true });
    io.to('admin_room').emit('session_updated', session);
    await sendAnalytics(io);
  });
};

// Helper for Analytics
async function sendAnalytics(io) {
  const totalSessions = await Conversation.countDocuments();
  const activeTickets = await Conversation.countDocuments({ status: 'active', mode: 'human' });
  const msgStats = await Conversation.aggregate([
      { $unwind: "$messages" },
      { $group: { _id: null, count: { $sum: 1 } } }
  ]);
  io.to('admin_room').emit('analytics_update', { 
    totalSessions, 
    activeTickets, 
    totalMessages: msgStats[0] ? msgStats[0].count : 0 
  });
}