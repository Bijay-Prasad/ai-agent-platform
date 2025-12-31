# 🤖 AI Live Chat Agent

A modern, intelligent customer support chat application built with the MERN stack and Next.js. Features real-time AI responses using Google Gemini, markdown rendering, and a beautiful, themable UI.

![Chat Light Mode](frontend/public/screenshots/chat-light.png)
*(Light and Dark mode support with Magic UI animations)*

## ✨ Features

- **🧠 Intelligent AI**: Powered by Google Gemini Pro for context-aware responses.
- **💬 Rich Text Support**: Full Markdown rendering (tables, code blocks, lists) in chat bubbles.
- **🎨 Modern UI**: Built with Next.js 16, Tailwind CSS v4, and Shadcn UI.
- **🌓 Dark/Light Mode**: Seamless theme switching with persistent preferences.
- **🔄 Session Management**: Chat history persistence via MongoDB.
- **💅 Polish**: Smooth animations using Framer Motion and Magic UI.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI, Magic UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI Service**: Google Gemini Generative AI

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-chat-db
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to chat with your AI agent!

## 📸 Screenshots

| Light Mode | Dark Mode |
|------------|-----------|
| ![Light Mode](frontend/public/screenshots/chat-light.png) | ![Dark Mode](frontend/public/screenshots/chat-dark.png) |

## 📝 License

This project is open source and available under the [MIT License](LICENSE).