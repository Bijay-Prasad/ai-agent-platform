# AI Live Chat Agent - Backend

A production-ready backend for an AI-powered customer support chat system built with Node.js, TypeScript, Express.js, MongoDB, and Google's Gemini AI.

## 🚀 Features

- **AI-Powered Chat**: Integration with Google Gemini AI for intelligent customer support responses
- **Conversation Management**: Persistent conversation history with MongoDB
- **RESTful API**: Clean, well-documented API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **TypeScript**: Full type safety throughout the application
- **Production Ready**: Configured for deployment on Render

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-chat-agent
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ai-chat-agent

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration (Frontend URL)
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB (if running locally)

```bash
# macOS/Linux
mongod

# Windows
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

### 5. Run the development server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "AI Chat Agent API is running",
  "timestamp": "2025-12-31T07:30:00.000Z",
  "environment": "development"
}
```

---

#### 2. Send Chat Message
```http
POST /api/chat/message
```

**Request Body:**
```json
{
  "message": "What's your return policy?",
  "sessionId": "optional-conversation-id"
}
```

**Response:**
```json
{
  "reply": "Our return policy allows you to return items within 30 days of delivery for a full refund. Items must be unused, unworn, and in original packaging with all tags attached. You can initiate a return through your account dashboard or contact our support team.",
  "sessionId": "676d8f9e1234567890abcdef",
  "timestamp": "2025-12-31T07:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Error",
  "message": "Message cannot be empty",
  "statusCode": 400
}
```

---

#### 3. Get Conversation History
```http
GET /api/chat/conversations/:id
```

**Response:**
```json
{
  "conversation": {
    "_id": "676d8f9e1234567890abcdef",
    "createdAt": "2025-12-31T07:00:00.000Z",
    "updatedAt": "2025-12-31T07:30:00.000Z"
  },
  "messages": [
    {
      "_id": "676d8f9e1234567890abc001",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "user",
      "text": "What's your return policy?",
      "timestamp": "2025-12-31T07:30:00.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc002",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "ai",
      "text": "Our return policy allows...",
      "timestamp": "2025-12-31T07:30:01.000Z"
    }
  ]
}
```

## 🧪 Testing the API

### Using cURL

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Send a message (new conversation):**
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your shipping options?"}'
```

**Send a message (existing conversation):**
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "How long does international shipping take?", "sessionId": "YOUR_SESSION_ID"}'
```

**Get conversation history:**
```bash
curl http://localhost:5000/api/chat/conversations/YOUR_SESSION_ID
```

### Using Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:5000/api`
3. Test each endpoint with the examples above

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.ts           # Environment configuration
│   │   ├── database.ts        # MongoDB connection
│   │   └── prompts.ts         # AI prompts and FAQ knowledge
│   ├── models/
│   │   ├── Conversation.ts    # Conversation schema
│   │   └── Message.ts         # Message schema
│   ├── services/
│   │   ├── gemini.service.ts  # Gemini AI integration
│   │   └── chat.service.ts    # Chat business logic
│   ├── routes/
│   │   └── chat.routes.ts     # Chat API routes
│   ├── middleware/
│   │   ├── errorHandler.ts    # Error handling
│   │   └── validation.ts      # Request validation
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── server.ts              # Express app setup
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Architecture Overview

### Layered Architecture

1. **Routes Layer** (`routes/`): Handles HTTP requests and responses
2. **Service Layer** (`services/`): Contains business logic
3. **Model Layer** (`models/`): Database schemas and data access
4. **Middleware Layer** (`middleware/`): Request validation and error handling

### Key Design Decisions

1. **Separation of Concerns**: Clear separation between routes, services, and models
2. **Error Handling**: Centralized error handling with custom error classes
3. **Validation**: Input validation at the middleware level
4. **Type Safety**: Full TypeScript coverage for better code quality
5. **Conversation Context**: AI receives last 10 messages for contextual responses
6. **Token Limits**: Max 500 tokens per response to control costs

### LLM Integration

**Provider**: Google Gemini AI (gemini-1.5-flash)

**Prompting Strategy**:
- System prompt defines the AI's role as a customer support agent
- FAQ knowledge base embedded in the prompt
- Conversation history included for context
- Temperature set to 0.7 for balanced creativity/consistency

**Error Handling**:
- API key validation
- Rate limit handling
- Timeout handling
- Graceful fallback messages

## 🚀 Deployment (Render)

### 1. Prepare for deployment

Build the TypeScript code:
```bash
npm run build
```

### 2. Create a Render account

Sign up at [render.com](https://render.com)

### 3. Create a new Web Service

1. Connect your GitHub repository
2. Configure the service:
   - **Name**: ai-chat-agent-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for production)

### 4. Add environment variables

In Render dashboard, add:
- `NODE_ENV=production`
- `MONGODB_URI=<your-mongodb-atlas-uri>`
- `GEMINI_API_KEY=<your-gemini-api-key>`
- `FRONTEND_URL=<your-frontend-url>`

### 5. Deploy

Render will automatically deploy your application.

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## 🔒 Security Considerations

- Environment variables for sensitive data
- Input validation on all endpoints
- CORS configuration for frontend access
- Error messages don't expose sensitive information
- MongoDB injection prevention through Mongoose

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError`

**Solution**: 
- Ensure MongoDB is running locally
- Check MONGODB_URI in .env
- For Atlas, whitelist your IP address

### Gemini API Issues

**Error**: `Invalid API key`

**Solution**:
- Verify GEMINI_API_KEY in .env
- Get a new key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Port Already in Use

**Error**: `EADDRINUSE`

**Solution**:
```bash
# Find and kill the process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

## 📈 Future Improvements

If I had more time, I would add:

- [ ] User authentication and authorization
- [ ] Rate limiting per user/IP
- [ ] Conversation analytics and insights
- [ ] Multi-language support
- [ ] WebSocket support for real-time chat
- [ ] Redis caching for conversation history
- [ ] Comprehensive test suite (unit + integration)
- [ ] API documentation with Swagger/OpenAPI
- [ ] Logging service integration (e.g., Winston, Sentry)
- [ ] CI/CD pipeline with automated tests

## 📄 License

ISC

## 👨‍💻 Author

Built for Spur - Founding Full-Stack Engineer Take-Home Assignment

---

**Note**: This is a demonstration project for the Spur take-home assignment. It showcases production-ready code quality, architecture, and best practices for building an AI-powered chat system.
