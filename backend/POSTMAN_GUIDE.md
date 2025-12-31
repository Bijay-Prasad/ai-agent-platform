# Postman Testing Guide for AI Live Chat Agent

## 🚀 Quick Start

### Step 1: Open Postman
- Download Postman from [postman.com](https://www.postman.com/downloads/) if you don't have it
- Or use the web version at [web.postman.co](https://web.postman.co/)

### Step 2: Create a New Collection
1. Click "New" → "Collection"
2. Name it: **AI Chat Agent API**
3. Save the collection

---

## 📋 Test Endpoints

### Test 1: Health Check ✅

**Purpose**: Verify the server is running

1. Click "New" → "Request"
2. Name: `Health Check`
3. Method: **GET**
4. URL: `http://localhost:5000/api/health`
5. Click **Send**

**Expected Response** (200 OK):
```json
{
  "status": "ok",
  "message": "AI Chat Agent API is running",
  "timestamp": "2025-12-31T08:15:00.000Z",
  "environment": "development"
}
```

---

### Test 2: Send First Message (New Conversation) 💬

**Purpose**: Start a new conversation with the AI

1. Click "New" → "Request"
2. Name: `Send Message - New Conversation`
3. Method: **POST**
4. URL: `http://localhost:5000/api/chat/message`
5. Go to **Headers** tab:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab:
   - Select **raw**
   - Select **JSON** from dropdown
   - Paste this:
   ```json
   {
     "message": "What are your shipping options?"
   }
   ```
7. Click **Send**

**Expected Response** (200 OK):
```json
{
  "reply": "We offer free standard shipping on orders over $50 within the United States, which takes 5-7 business days. We also have express shipping available for $15, delivered in 2-3 business days. For international orders, we ship to over 100 countries with delivery typically taking 10-15 business days.",
  "sessionId": "676d8f9e1234567890abcdef",
  "timestamp": "2025-12-31T08:15:05.000Z"
}
```

**⚠️ IMPORTANT**: Copy the `sessionId` from the response! You'll need it for the next tests.

---

### Test 3: Continue Conversation 🔄

**Purpose**: Send a follow-up message in the same conversation

1. Click "New" → "Request"
2. Name: `Send Message - Continue Conversation`
3. Method: **POST**
4. URL: `http://localhost:5000/api/chat/message`
5. Headers:
   - Key: `Content-Type`
   - Value: `application/json`
6. Body (raw JSON):
   ```json
   {
     "message": "How long does international shipping take?",
     "sessionId": "PASTE_YOUR_SESSION_ID_HERE"
   }
   ```
   **Replace `PASTE_YOUR_SESSION_ID_HERE` with the actual sessionId from Test 2!**

7. Click **Send**

**Expected Response** (200 OK):
```json
{
  "reply": "International shipping typically takes 10-15 business days. You'll receive a tracking number via email once your order ships so you can monitor its progress.",
  "sessionId": "676d8f9e1234567890abcdef",
  "timestamp": "2025-12-31T08:15:10.000Z"
}
```

---

### Test 4: Get Conversation History 📜

**Purpose**: Retrieve all messages from a conversation

1. Click "New" → "Request"
2. Name: `Get Conversation History`
3. Method: **GET**
4. URL: `http://localhost:5000/api/chat/conversations/PASTE_YOUR_SESSION_ID_HERE`
   
   **Replace `PASTE_YOUR_SESSION_ID_HERE` with your actual sessionId!**

5. Click **Send**

**Expected Response** (200 OK):
```json
{
  "conversation": {
    "_id": "676d8f9e1234567890abcdef",
    "createdAt": "2025-12-31T08:15:00.000Z",
    "updatedAt": "2025-12-31T08:15:10.000Z"
  },
  "messages": [
    {
      "_id": "676d8f9e1234567890abc001",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "user",
      "text": "What are your shipping options?",
      "timestamp": "2025-12-31T08:15:05.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc002",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "ai",
      "text": "We offer free standard shipping...",
      "timestamp": "2025-12-31T08:15:06.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc003",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "user",
      "text": "How long does international shipping take?",
      "timestamp": "2025-12-31T08:15:10.000Z"
    },
    {
      "_id": "676d8f9e1234567890abc004",
      "conversationId": "676d8f9e1234567890abcdef",
      "sender": "ai",
      "text": "International shipping typically takes...",
      "timestamp": "2025-12-31T08:15:11.000Z"
    }
  ]
}
```

---

## 🧪 Additional Test Scenarios

### Test 5: Ask About Returns

Body (raw JSON):
```json
{
  "message": "What's your return policy?"
}
```

### Test 6: Ask About Support Hours

Body (raw JSON):
```json
{
  "message": "What are your support hours?"
}
```

### Test 7: Ask About Payment Methods

Body (raw JSON):
```json
{
  "message": "What payment methods do you accept?"
}
```

---

## ❌ Error Testing

### Test 8: Empty Message (Should Fail)

Body (raw JSON):
```json
{
  "message": ""
}
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Error",
  "message": "Message cannot be empty",
  "statusCode": 400
}
```

### Test 9: Missing Message Field (Should Fail)

Body (raw JSON):
```json
{}
```

**Expected Response** (400 Bad Request):
```json
{
  "error": "Error",
  "message": "Message is required",
  "statusCode": 400
}
```

### Test 10: Invalid Session ID (Should Fail)

Body (raw JSON):
```json
{
  "message": "Hello",
  "sessionId": "invalid-id-123"
}
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

## 💡 Pro Tips

### Using Postman Variables

1. **Save sessionId as a variable**:
   - After Test 2, go to the **Tests** tab
   - Add this script:
   ```javascript
   var jsonData = pm.response.json();
   pm.collectionVariables.set("sessionId", jsonData.sessionId);
   ```
   - Now you can use `{{sessionId}}` in other requests!

2. **Use the variable in requests**:
   - In Test 3 and Test 4, replace the sessionId with: `{{sessionId}}`
   - Example URL: `http://localhost:5000/api/chat/conversations/{{sessionId}}`

### Organizing Your Collection

Create folders in your collection:
- **✅ Core Endpoints** (Health, Send Message, Get Conversation)
- **🧪 Test Scenarios** (Different questions)
- **❌ Error Cases** (Empty message, invalid ID, etc.)

### Save Example Responses

After each successful test:
1. Click "Save Response"
2. Name it (e.g., "Success - Shipping Question")
3. This helps document expected behavior

---

## 🎯 Complete Test Flow

Follow this sequence to test the entire system:

1. ✅ **Health Check** → Verify server is running
2. 💬 **Send First Message** → Get sessionId
3. 🔄 **Continue Conversation** → Test context awareness
4. 📜 **Get History** → Verify persistence
5. ❌ **Test Error Cases** → Verify validation

---

## 🐛 Troubleshooting

### "Could not get any response"
- ✅ Check if server is running: `npm run dev`
- ✅ Verify URL is correct: `http://localhost:5000`
- ✅ Check if MongoDB is running

### "GEMINI_API_KEY is required"
- ✅ Ensure `.env` file exists in `backend/` directory
- ✅ Verify `GEMINI_API_KEY` is set in `.env`
- ✅ Restart the server

### "MongoDB connection error"
- ✅ Start MongoDB: `mongod`
- ✅ Or use MongoDB Atlas connection string
- ✅ Check `MONGODB_URI` in `.env`

### Response takes too long
- ⏱️ Gemini AI can take 1-3 seconds to respond
- ⏱️ This is normal for AI processing
- ⏱️ Increase Postman timeout if needed (Settings → General → Request timeout)

---

## 📸 Expected Results Summary

| Test | Method | Endpoint | Expected Status | Response Time |
|------|--------|----------|----------------|---------------|
| Health Check | GET | `/api/health` | 200 OK | < 50ms |
| Send Message | POST | `/api/chat/message` | 200 OK | 1-3 seconds |
| Get History | GET | `/api/chat/conversations/:id` | 200 OK | < 200ms |
| Empty Message | POST | `/api/chat/message` | 400 Bad Request | < 50ms |
| Invalid ID | POST | `/api/chat/message` | 400 Bad Request | < 50ms |

---

## 🎉 Success Criteria

✅ Health check returns 200 OK  
✅ Can send a message and get AI response  
✅ SessionId is returned and persisted  
✅ Can continue conversation with same sessionId  
✅ AI responses are contextual and accurate  
✅ Conversation history is retrievable  
✅ Error cases return proper error messages  
✅ No server crashes on invalid input  

---

**Happy Testing! 🚀**

For more detailed testing scenarios, see [API_TESTING.md](./API_TESTING.md)
