import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: String, enum: ['user', 'ai', 'agent', 'system'] },
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  mode: { type: String, enum: ['bot', 'human'], default: 'bot' },
  messages: [messageSchema],
  lastActive: { type: Date, default: Date.now }
});

export default mongoose.model('Conversation', conversationSchema);