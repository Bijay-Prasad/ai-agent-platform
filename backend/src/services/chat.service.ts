import { Conversation, ConversationDocument } from '../models/Conversation';
import { Message, MessageDocument } from '../models/Message';
import { geminiService } from './gemini.service';
import { ChatRequest, ChatResponse } from '../types';

/**
 * Chat Service
 * Handles all chat-related business logic
 */
class ChatService {
  /**
   * Process a chat message and generate AI response
   */
  async processMessage(request: ChatRequest): Promise<ChatResponse> {
    const { message, sessionId } = request;

    // Validate input
    const validation = geminiService.validateInput(message);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Get or create conversation
    let conversationId: string;
    if (sessionId) {
      // Verify conversation exists
      const existingConversation = await Conversation.findById(sessionId);
      if (!existingConversation) {
        throw new Error('Invalid session ID');
      }
      conversationId = sessionId;
    } else {
      // Create new conversation
      const newConversation = await Conversation.create({});
      conversationId = newConversation._id.toString();
    }

    // Save user message
    await this.saveMessage(conversationId, 'user', message);

    // Get conversation history
    const history = await this.getConversationHistory(conversationId);

    // Generate AI response
    const aiReply = await geminiService.generateReply(history, message);

    // Save AI response
    await this.saveMessage(conversationId, 'ai', aiReply);

    return {
      reply: aiReply,
      sessionId: conversationId,
      timestamp: new Date(),
    };
  }

  /**
   * Get conversation history by ID
   */
  async getConversationHistory(conversationId: string): Promise<MessageDocument[]> {
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 })
      .exec();

    return messages;
  }

  /**
   * Save a message to the database
   */
  private async saveMessage(
    conversationId: string,
    sender: 'user' | 'ai',
    text: string
  ): Promise<MessageDocument> {
    const message = await Message.create({
      conversationId,
      sender,
      text,
      timestamp: new Date(),
    });

    return message;
  }

  /**
   * Get conversation with messages
   */
  async getConversation(conversationId: string) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const messages = await this.getConversationHistory(conversationId);

    return {
      conversation,
      messages,
    };
  }
}

export const chatService = new ChatService();
