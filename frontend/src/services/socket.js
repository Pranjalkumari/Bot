import { io } from "socket.io-client";

// Create a single instance to prevent multiple connections
const socket = io("http://localhost:3002");

export default socket;