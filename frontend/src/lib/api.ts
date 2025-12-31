export interface Message {
  _id?: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp?: string;
}

interface ChatResponse {
  reply: string;
  sessionId: string;
  timestamp: string;
}

interface HistoryResponse {
  conversation: {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
  messages: Message[];
}

const API_Base_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const chatApi = {
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_Base_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send message');
    }

    return response.json();
  },

  getHistory: async (sessionId: string): Promise<HistoryResponse> => {
    const response = await fetch(`${API_Base_URL}/chat/conversations/${sessionId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch history');
    }

    return response.json();
  },
};
