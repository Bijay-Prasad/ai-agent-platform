# Quick Postman Testing Reference

## ✅ Server Status: RUNNING

Your backend is now successfully running on `http://localhost:5000`

---

## 🎯 Quick Test in Postman

### 1️⃣ Health Check (GET)

![Postman Health Check Example](C:/Users/bijay/.gemini/antigravity/brain/dd23d374-62b4-4e67-8a7c-595b001e0924/postman_health_check_1767169066890.png)

**Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/health`
- Click **Send**

**Expected:** Status `200 OK` with server info

---

### 2️⃣ Send Chat Message (POST)

![Postman Send Message Example](C:/Users/bijay/.gemini/antigravity/brain/dd23d374-62b4-4e67-8a7c-595b001e0924/postman_send_message_1767169090580.png)

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/chat/message`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "message": "What are your shipping options?"
}
```
- Click **Send**

**Expected:** Status `200 OK` with AI reply and sessionId

---

### 3️⃣ Continue Conversation (POST)

**Setup:**
- Method: `POST`
- URL: `http://localhost:5000/api/chat/message`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "message": "How long does it take?",
  "sessionId": "PASTE_SESSION_ID_FROM_STEP_2"
}
```

---

### 4️⃣ Get Conversation History (GET)

**Setup:**
- Method: `GET`
- URL: `http://localhost:5000/api/chat/conversations/PASTE_SESSION_ID`

---

## 📝 Sample Questions to Test

Try asking the AI about:

✅ **Shipping**: "What are your shipping options?"  
✅ **Returns**: "What's your return policy?"  
✅ **Support**: "What are your support hours?"  
✅ **Payment**: "What payment methods do you accept?"  
✅ **Warranty**: "Do you have a warranty?"  

---

## 🐛 Common Issues

**"Could not get any response"**
→ Make sure server is running: `npm run dev`

**"GEMINI_API_KEY is required"**
→ Check `.env` file exists with your API key

**Response takes 2-3 seconds**
→ Normal! AI processing takes time

---

## 📚 Full Documentation

- **Complete Guide**: See [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)
- **All Test Scenarios**: See [API_TESTING.md](./API_TESTING.md)
- **Setup Instructions**: See [README.md](./README.md)

---

**🎉 Your backend is ready! Start testing in Postman now!**
