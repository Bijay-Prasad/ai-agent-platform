# Quick Setup Guide

Follow these steps to get the backend running:

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-chat-agent

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration (Frontend URL)
FRONTEND_URL=http://localhost:3000
```

### Get Your Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in the `.env` file

## 3. Start MongoDB

### Option A: Local MongoDB
```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` with the Atlas connection string

## 4. Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server is running on port 5000
📝 Environment: development
🌐 Health check: http://localhost:5000/api/health
```

## 5. Test the API

### Quick Health Check:
```bash
curl http://localhost:5000/api/health
```

### Send a Test Message:
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What are your shipping options?\"}"
```

## Next Steps

- See [README.md](./README.md) for full documentation
- See [API_TESTING.md](./API_TESTING.md) for comprehensive testing guide
- Start building the frontend!

## Common Issues

### "GEMINI_API_KEY is required"
→ Make sure you created the `.env` file and added your API key

### "MongoDB connection error"
→ Ensure MongoDB is running or check your Atlas connection string

### Port 5000 already in use
→ Change `PORT` in `.env` to a different port (e.g., 5001)
