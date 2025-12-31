# API Testing Guide

This document provides comprehensive testing instructions for the AI Live Chat Agent backend API.

## Prerequisites

Before testing, ensure:
1. MongoDB is running (locally or Atlas)
2. `.env` file is configured with all required variables
3. Server is running on `http://localhost:5000`

## Quick Start

### 1. Start the server

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

### 2. Test the health endpoint

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "AI Chat Agent API is running",
  "timestamp": "2025-12-31T07:30:00.000Z",
  "environment": "development"
}
```

## Test Scenarios

### Scenario 1: New Conversation

**Test**: Start a new conversation about shipping

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What are your shipping options?\"}"
```

**Expected Response**:
```json
{
  "reply": "We offer free standard shipping on orders over $50 within the United States, which takes 5-7 business days. We also have express shipping available for $15, delivered in 2-3 business days. For international orders, we ship to over 100 countries with delivery typically taking 10-15 business days.",
  "sessionId": "676d8f9e1234567890abcdef",
  "timestamp": "2025-12-31T07:30:00.000Z"
}
```

**Save the `sessionId` for the next tests!**

---

### Scenario 2: Continue Conversation

**Test**: Ask a follow-up question in the same conversation

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"How long does international shipping take?\", \"sessionId\": \"YOUR_SESSION_ID_HERE\"}"
```

**Expected Response**:
```json
{
  "reply": "International shipping typically takes 10-15 business days. You'll receive a tracking number via email once your order ships so you can monitor its progress.",
  "sessionId": "676d8f9e1234567890abcdef",
  "timestamp": "2025-12-31T07:30:05.000Z"
}
```

---

### Scenario 3: Ask About Returns

**Test**: Ask about return policy

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"What's your return policy?\"}"
```

**Expected Response**:
```json
{
  "reply": "You can return items within 30 days of delivery for a full refund. Items must be unused, unworn, and in original packaging with all tags attached. You can initiate a return through your account dashboard or contact our support team. Refunds are processed within 5-7 business days after we receive your return.",
  "sessionId": "676d8f9e9876543210fedcba",
  "timestamp": "2025-12-31T07:31:00.000Z"
}
```

---

### Scenario 4: Get Conversation History

**Test**: Retrieve all messages from a conversation

```bash
curl http://localhost:5000/api/chat/conversations/YOUR_SESSION_ID_HERE
```

**Expected Response**:
```json
{
  "conversation": {
    "_id": "676d8f9e1234567890abcdef",
    "createdAt": "2025-12-31T07:30:00.000Z",
    "updatedAt": "2025-12-31T07:30:05.000Z"
  },
  "messages": [
    {
      "_id": "676d8f9e1234567890abc001",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "user",
      "text": "What are your shipping options?",
      "timestamp": "2025-12-31T07:30:00.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc002",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "ai",
      "text": "We offer free standard shipping...",
      "timestamp": "2025-12-31T07:30:01.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc003",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "user",
      "text": "How long does international shipping take?",
      "timestamp": "2025-12-31T07:30:05.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc004",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "ai",
      "text": "International shipping typically takes...",
      "timestamp": "2025-12-31T07:30:06.000Z"
    }
  ]
}
```

---

## Error Handling Tests

### Test 1: Empty Message

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"\"}"
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Error",
  "message": "Message cannot be empty",
  "statusCode": 400
}
```

---

### Test 2: Missing Message Field

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{}"
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Error",
  "message": "Message is required",
  "statusCode": 400
}
```

---

### Test 3: Message Too Long

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"$(python -c 'print(\"a\" * 2001)')\"}"
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Error",
  "message": "Message is too long (max 2000 characters)",
  "statusCode": 400
}
```

---

### Test 4: Invalid Session ID Format

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Hello\", \"sessionId\": \"invalid-id\"}"
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Error",
  "message": "Invalid session ID format",
  "statusCode": 400
}
```

---

### Test 5: Non-existent Conversation

```bash
curl http://localhost:5000/api/chat/conversations/676d8f9e1234567890000000
```

**Expected Response** (500 Internal Server Error):
```json
{
  "error": "Error",
  "message": "Conversation not found",
  "statusCode": 500
}
```

---

### Test 6: Invalid Route

```bash
curl http://localhost:5000/api/invalid-route
```

**Expected Response** (404 Not Found):
```json
{
  "error": "Not Found",
  "message": "Route GET /api/invalid-route not found"
}
```

---

## Postman Collection

### Import these requests into Postman:

1. **Health Check**
   - Method: GET
   - URL: `http://localhost:5000/api/health`

2. **Send Message (New Conversation)**
   - Method: POST
   - URL: `http://localhost:5000/api/chat/message`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "message": "What are your shipping options?"
     }
     ```

3. **Send Message (Existing Conversation)**
   - Method: POST
   - URL: `http://localhost:5000/api/chat/message`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "message": "How long does international shipping take?",
       "sessionId": "{{sessionId}}"
     }
     ```

4. **Get Conversation History**
   - Method: GET
   - URL: `http://localhost:5000/api/chat/conversations/{{sessionId}}`

---

## Testing with JavaScript/Fetch

```javascript
// Test 1: Send a message
async function sendMessage(message, sessionId = null) {
  const response = await fetch('http://localhost:5000/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      sessionId,
    }),
  });

  const data = await response.json();
  console.log('Response:', data);
  return data;
}

// Test 2: Get conversation history
async function getConversation(sessionId) {
  const response = await fetch(
    `http://localhost:5000/api/chat/conversations/${sessionId}`
  );

  const data = await response.json();
  console.log('Conversation:', data);
  return data;
}

// Run tests
(async () => {
  // Start new conversation
  const result1 = await sendMessage('What are your shipping options?');
  const sessionId = result1.sessionId;

  // Continue conversation
  const result2 = await sendMessage(
    'How long does international shipping take?',
    sessionId
  );

  // Get full history
  const history = await getConversation(sessionId);
})();
```

---

## Sample FAQ Questions to Test

Try these questions to test the AI's knowledge:

1. **Shipping**:
   - "What are your shipping options?"
   - "Do you ship internationally?"
   - "How long does shipping take?"
   - "Can I track my order?"

2. **Returns**:
   - "What's your return policy?"
   - "How do I return an item?"
   - "How long do refunds take?"
   - "Is return shipping free?"

3. **Support**:
   - "What are your support hours?"
   - "How can I contact support?"
   - "Do you have phone support?"

4. **Payment**:
   - "What payment methods do you accept?"
   - "Is my payment secure?"

5. **Products**:
   - "Do you have a warranty?"
   - "Can I modify my order?"
   - "What if I ordered the wrong size?"

---

## Monitoring & Debugging

### Check MongoDB Data

```bash
# Connect to MongoDB
mongosh

# Use the database
use ai-chat-agent

# View all conversations
db.conversations.find().pretty()

# View all messages
db.messages.find().pretty()

# View messages for a specific conversation
db.messages.find({ conversationId: "YOUR_SESSION_ID" }).sort({ timestamp: 1 })

# Count total conversations
db.conversations.countDocuments()

# Count total messages
db.messages.countDocuments()
```

### Server Logs

The server logs will show:
- Incoming requests: `2025-12-31T07:30:00.000Z - POST /api/chat/message`
- Database connections: `✅ MongoDB Connected: localhost`
- Errors: `❌ Error: ...`

---

## Expected Behavior

### ✅ Correct Behavior

1. **Contextual Responses**: AI should remember previous messages in the conversation
2. **Accurate Information**: Responses should match the FAQ knowledge base
3. **Error Handling**: Invalid inputs should return clear error messages
4. **Persistence**: Conversations should be saved and retrievable
5. **Session Management**: New conversations get new sessionIds, existing ones maintain their ID

### ❌ Issues to Watch For

1. **Empty Responses**: AI returns empty string
2. **Out of Context**: AI doesn't remember previous messages
3. **Hallucinations**: AI makes up information not in the knowledge base
4. **Crashes**: Server crashes on invalid input
5. **Database Errors**: Messages not being saved

---

## Performance Testing

### Load Test (Simple)

```bash
# Send 10 concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/chat/message \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"Test message $i\"}" &
done
wait
```

### Expected Performance

- Health check: < 10ms
- New message (with AI): 1-3 seconds (depends on Gemini API)
- Get conversation: < 100ms
- Conversation with 10 messages: < 200ms

---

## Troubleshooting

### Issue: "GEMINI_API_KEY is required"

**Solution**: Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Issue: "MongoDB connection error"

**Solution**: 
1. Ensure MongoDB is running: `mongod` or check Atlas connection
2. Verify `MONGODB_URI` in `.env`

### Issue: "AI service is temporarily unavailable"

**Solution**: 
1. Check Gemini API quota/rate limits
2. Verify API key is valid
3. Check internet connection

---

## Success Criteria

✅ All endpoints return expected responses  
✅ Error cases are handled gracefully  
✅ Conversations are persisted to MongoDB  
✅ AI provides contextual, accurate responses  
✅ No server crashes on invalid input  
✅ Session management works correctly  

---

**Ready to test!** Start with the health check and work through the scenarios above.
