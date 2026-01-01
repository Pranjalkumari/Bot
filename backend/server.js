import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import { handleSocketConnection } from './src/sockets/chat.socket.js';

const app = express();
const httpServer = createServer(app);

// Initialize DB
connectDB();

// Initialize Socket
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => handleSocketConnection(io, socket));

const PORT = process.env.PORT || 4002;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));