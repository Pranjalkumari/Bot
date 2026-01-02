
# Project Title

Real-Time Customer Support Chat Application

# Project Description 

A full-stack real-time customer support chat system that allows users to chat with an AI bot or a human agent, and provides admins with a powerful dashboard to manage conversations and view analytics.
## Features





 **👤 User Side**
- Floating chatbot widget available on the website
- Real-time messaging using **WebSockets**
- Persistent chat sessions using **localStorage**
- Automatic bot responses
- Smooth UI with auto-scroll and clean chat bubbles

---

 **📊 Admin Dashboard**
- View all active chat sessions in real time
- Switch between **Bot Mode 🤖** and **Human Agent Mode 👩‍💻**
- Reply to users directly as an agent
- Live session updates without page refresh
- Built-in analytics view including:
  - Total chat sessions
  - Chats requiring human intervention
  - Total messages exchanged

---

 **Analytics**
- Real-time statistics powered by **Socket events**
- Clean, minimal visual cards for quick insights

##  Tech Stack

 **Client (Frontend)**
- React
- Tailwind CSS
- Socket.IO Client
- React Icons

**Server (Backend)**
- Node.js
- Express.js
- Socket.IO

 **Database**
- MongoDB

 **Other Tools & Concepts**
- WebSockets for real-time communication
- UUID for session management
- LocalStorage for persistent chat sessions

## How It Works

 **When a user opens the website:**

- A unique session ID is created and stored in localStorage

- The user joins a Socket session

**Messages are:** 

- Sent in real time using Socket.io

- Stored in MongoDB for persistence

**Admin:**

- Joins the admin socket room

- Sees all sessions instantly

- Can switch any session between bot and human mode

**Analytics:**

- Updated live via socket events

- No page reload required
