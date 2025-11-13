# Moduo

> **Code together, live.** A real-time collaborative coding interview platform built with the MERN stack.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://moduo.onrender.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Application Flow](#-application-flow)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Key Technologies Explained](#-key-technologies-explained)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

**Moduo** is a comprehensive platform designed for conducting technical coding interviews in real-time. It combines video calling, live chat, and collaborative code editing into a single, seamless experience. Perfect for practicing DSA problems, conducting mock interviews, or hosting actual technical screenings.

---

## ✨ Features

- 🎥 **HD Video Calls** - Crystal-clear video and audio powered by GetStream.io
- 💬 **Real-time Chat** - Integrated messaging during interview sessions
- 👨‍💻 **Live Code Editor** - Monaco editor with syntax highlighting for JavaScript, Python, and Java
- ▶️ **Code Execution** - Run code directly in the browser using Piston API
- 🔐 **Secure Authentication** - User management via Clerk
- 📊 **Session Management** - Create, join, and manage interview sessions
- 🎨 **Responsive Design** - Beautiful UI with TailwindCSS and DaisyUI
- 📱 **Desktop-First** - Optimized for desktop experience
- 🔄 **Resizable Panels** - Flexible layout with adjustable sections

---

## 🛠 Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **TailwindCSS 4 + DaisyUI** - Styling framework
- **Monaco Editor** - Code editor component
- **GetStream.io Video & Chat SDKs** - Real-time communication
- **Clerk React** - Authentication
- **TanStack Query** - Server state management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Canvas Confetti** - Success animations

### Backend

- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **Clerk Express** - Server-side auth middleware
- **GetStream.io Node SDK** - Video/chat server operations
- **Inngest** - Background job processing & webhooks
- **Piston API** - Code execution service

---

## 🏗 Architecture Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├──── Clerk Auth ────┐
       │                    │
       ├──── React App      │
       │                    ▼
       │              ┌──────────┐
       │              │  Clerk   │
       │              │ (Auth)   │
       │              └────┬─────┘
       │                   │ Webhooks
       ▼                   ▼
┌─────────────────┐  ┌──────────┐
│  Express API    │  │ Inngest  │
│  + MongoDB      │◄─┤ (Events) │
└────┬────────────┘  └──────────┘
     │
     ├── Stream.io (Video/Chat)
     │   • Create calls/channels
     │   • Generate tokens
     │   • Delete resources
     │
     └── Piston API
         • Execute user code
         • Return stdout/stderr
```

---

## 🔄 Application Flow

### 1️⃣ User Registration & Authentication

```
User signs up
    ↓
Clerk creates account
    ↓
Clerk webhook → Inngest event → "clerk/user.created"
    ↓
Backend: Inngest function processes event
    ↓
MongoDB: Create User document {clerkId, name, email, profileImageUrl}
    ↓
Stream.io: Upsert user with chatClient.upsertUser()
    ↓
User can now access the app
```

### 2️⃣ Session Creation Flow

```
Host clicks "Create Session"
    ↓
Frontend: POST /api/sessions {problemTitle, difficulty}
    ↓
Backend:
  1. Create Session document in MongoDB
  2. Generate unique callId
  3. Create Stream video call with streamClient.video.call()
  4. Create Stream chat channel with chatClient.channel()
    ↓
Frontend: Navigate to /sessions/:sessionId
    ↓
User sees session page with video call + chat + code editor
```

### 3️⃣ Participant Joining Flow

```
Participant opens session URL
    ↓
Frontend: GET /api/sessions/:sessionId
    ↓
Backend: Return session data
    ↓
Frontend: Check if user is host/participant
    ↓
If neither → POST /api/sessions/:sessionId/join
    ↓
Backend:
  1. Update session.participantId in MongoDB
  2. Add user to Stream chat channel
    ↓
Frontend: User can now see video + chat + code editor
```

### 4️⃣ GetStream Initialization (Video + Chat)

```
User enters session page
    ↓
Frontend: GET /api/chats/token
    ↓
Backend: Generate token using chatClient.createToken(clerkUserId)
    ↓
Frontend: Initialize GetStream clients
  1. Create StreamVideoClient with token
  2. Join video call: call.join()
  3. Connect chat: StreamChat.connectUser()
  4. Watch channel: channel.watch()
    ↓
Render CallAndChatUI component
```

### 5️⃣ Code Execution Flow

```
User writes code in Monaco editor
    ↓
User clicks "Run"
    ↓
Frontend: Send code to Piston API
  POST https://emkc.org/api/v2/piston/execute
  {language, version, files: [{name, content}]}
    ↓
Piston API: Execute code in isolated container
    ↓
Return {stdout, stderr, output, code}
    ↓
Frontend: Display output in OutputPanel
  • Success → Show output + confetti 🎉
  • Error → Show error message
```

### 6️⃣ Session End Flow (Host Only)

```
Host clicks "End Session"
    ↓
Frontend: POST /api/sessions/:sessionId/end
    ↓
Backend:
  1. Verify user is host
  2. Delete GetStream video call (hard delete)
  3. Delete GetStream chat channel (hard delete)
  4. Update session.status = "completed" in MongoDB
    ↓
Frontend:
  1. Leave video call: call.leave()
  2. Disconnect chat: chatClient.disconnectUser()
  3. Disconnect video: videoClient.disconnectUser()
  4. Navigate to /dashboard
```

---

## 📦 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 10.x (package manager)
- **MongoDB** (Atlas or local)
- **Clerk Account** (for authentication)
- **GetStream.io Account** (for video/chat)
- **Inngest Account** (for webhooks)

---

## 🔐 Environment Variables

### Frontend (`.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SERVER_BASE_URL=http://localhost:3000/api
VITE_STREAM_ACCESS_KEY=xxxxx
```

### Backend (`.env`)

```env
NODE_ENV=development
PORT=3000
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/moduo
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
STREAM_ACCESS_KEY=xxxxx
STREAM_ACCESS_SECRET=xxxxx
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KeepSerene/moduo-video-calling-interview-platform-mern.git
cd moduo
```

### 2. Install Dependencies

```bash

# Install backend dependencies
cd backend
pnpm install

# Install frontend dependencies
cd ../frontend
pnpm install
```

### 3. Set Up Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories with the variables listed above.

### 4. Configure Clerk Webhooks

1. Go to your Clerk dashboard
2. Navigate to **Webhooks**
3. Add endpoint: `https://your-domain.com/api/inngest`
4. Subscribe to events: `user.created`, `user.deleted`
5. Copy the webhook secret to your Inngest configuration

### 5. Run the Application

```bash
# From root directory - Development mode
cd backend
pnpm run dev

# In another terminal
cd frontend
pnpm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:3000`.

### 6. Build for Production

```bash
# From root directory
pnpm run build
pnpm start
```

This builds the frontend and serves it from the backend Express server.

---

## 📁 Project Structure (Tentative!)

```
moduo/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── sessions.controller.js
│   │   │   └── streamToken.controller.js
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   ├── inngest.js
│   │   │   └── stream.js
│   │   ├── middlewares/
│   │   │   └── protectRoute.middleware.js
│   │   ├── models/
│   │   │   ├── Session.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── chats.route.js
│   │   │   └── sessions.route.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── api/
│   │   │   └── sessions.js
│   │   ├── components/
│   │   │   ├── CallAndChatUI.jsx
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── CreateSessionModal.jsx
│   │   │   └── ...
│   │   ├── data/
│   │   │   └── problems.js
│   │   ├── hooks/
│   │   │   ├── useSessions.js
│   │   │   └── useStream.js
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   ├── piston.js
│   │   │   ├── stream.js
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProblemDetailsPage.jsx
│   │   │   ├── ProblemsPage.jsx
│   │   │   └── SessionPage.jsx
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
└── package.json
```

---

## 🌐 API Endpoints

### Sessions

| Method | Endpoint                        | Description                | Auth Required |
| ------ | ------------------------------- | -------------------------- | ------------- |
| POST   | `/api/sessions`                 | Create new session         | ✅            |
| GET    | `/api/sessions/active`          | Get all active sessions    | ✅            |
| GET    | `/api/sessions/recent`          | Get user's recent sessions | ✅            |
| GET    | `/api/sessions/:sessionId`      | Get session by ID          | ✅            |
| POST   | `/api/sessions/:sessionId/join` | Join a session             | ✅            |
| POST   | `/api/sessions/:sessionId/end`  | End a session (host only)  | ✅            |

### Chat

| Method | Endpoint           | Description                  | Auth Required |
| ------ | ------------------ | ---------------------------- | ------------- |
| GET    | `/api/chats/token` | Get GetStream token for user | ✅            |

### Webhooks

| Method | Endpoint       | Description                               |
| ------ | -------------- | ----------------------------------------- |
| POST   | `/api/inngest` | Inngest webhook endpoint for Clerk events |

---

## 📸 Screenshots

### Dashboard

![Dashboard](./frontend/public/moduo-dashboard.png "Moduo Dashboard Page Desktop View")

### Session Page

![Session Page](./frontend/public/moduo-session.png "Moduo Session Page Desktop View")

---

## 🚢 Deployment

### Deploy to Render.com

1. **Create a Web Service**

   - Connect your GitHub repository
   - Root directory: `.`
   - Build command: `pnpm run build`
   - Start command: `pnpm start`

2. **Add Environment Variables**

   - Add all backend environment variables in Render dashboard
   - Set `NODE_ENV=production`
   - Set `CLIENT_URL` to your Render URL

3. **Update Clerk Webhook**

   - Update webhook URL to `https://your-app.onrender.com/api/inngest`

4. **MongoDB Atlas**
   - Whitelist Render's IP addresses or use `0.0.0.0/0` for development
   - Update `DB_URL` in environment variables

---

## 🔑 Key Technologies Explained

### GetStream.io Architecture

**Backend (Server SDK) - With API Secret:**

- ✅ Create video calls and chat channels
- ✅ Generate user tokens
- ✅ Delete calls/channels (hard delete)
- ✅ Add members to channels

**Frontend (Client SDK) - With User Token:**

- ✅ Connect user to video client
- ✅ Join existing video calls
- ✅ Connect user to chat
- ✅ Watch chat channels
- ✅ Render video/chat UI

**Security Flow:**

```
User → Request token → Backend verifies with Clerk
  ↓
Backend generates GetStream token with chatClient.createToken()
  ↓
Frontend uses token to connect to Stream
  ↓
GetStream validates token → Allows connection
```

### Inngest Integration

Inngest handles asynchronous events from Clerk webhooks:

1. **User Created**: `clerk/user.created`

   - Creates MongoDB user document
   - Upserts GetStream.io user profile

2. **User Deleted**: `clerk/user.deleted`
   - Removes MongoDB user document
   - Deletes GetStream.io user profile

This ensures user data stays synchronized across all services.

---

## 📄 License

This project is licensed under the Apache 2.0 License.

---

## 👨‍💻 Author

**Dhrubajyoti Bhattacharjee**

---

## 🙏 Acknowledgments

- [GetStream.io](https://getstream.io/) - Video and chat infrastructure
- [Clerk](https://clerk.com/) - Authentication
- [Piston](https://github.com/engineer-man/piston) - Code execution engine
- [Inngest](https://www.inngest.com/) - Background jobs
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor

---

**Made with ❤️ for the developer community**
