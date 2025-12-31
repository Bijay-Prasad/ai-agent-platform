export interface IMessage {
  conversationId: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface IConversation {
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    userAgent?: string;
    ip?: string;
  };
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  timestamp: Date;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
