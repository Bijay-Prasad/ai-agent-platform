import { GoogleGenAI } from '@google/genai';
import config from '../config';
import { SYSTEM_PROMPT } from '../config/prompts';
import { MessageDocument } from '../models/Message';

/**
 * Gemini AI Service with Multi-Model Fallback
 * Handles all interactions with Google's Gemini AI API
 * Tries multiple models in order to handle rate limits and availability
 */
class GeminiService {
  private ai: GoogleGenAI | null = null;
  private readonly MODELS = [
    'gemini-2.5-flash',       // try first (best, but tiny quota)
    'gemini-2.5-flash-lite',
    'gemini-3-pro-preview',  // Thinking model
  ];
  private readonly MAX_TOKENS = 1000;
  private readonly TEMPERATURE = 0.4;

  constructor() {
    // Lazy initialization - will be initialized on first use
  }

  /**
   * Initialize the Gemini AI client (lazy initialization)
   */
  private initialize() {
    if (this.ai) {
      return; // Already initialized
    }

    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is required but not provided');
    }

    this.ai = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });
  }

  /**
   * Clean JSON response from AI (removes markdown code blocks)
   */
  private cleanJSON(text: string): string {
    return text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
  }

  /**
   * Generate a reply from the AI agent with multi-model fallback
   * @param conversationHistory - Array of previous messages in the conversation
   * @param userMessage - The current user message
   * @returns AI-generated response
   */
  async generateReply(
    conversationHistory: MessageDocument[],
    userMessage: string
  ): Promise<string> {
    // Ensure Gemini client is initialized
    this.initialize();

    if (!this.ai) {
      throw new Error('Gemini AI client not initialized');
    }

    // Build conversation context
    const prompt = this.buildConversationContext(conversationHistory, userMessage);

    let lastError: any = null;

    // Try each model in order
    for (const model of this.MODELS) {
      try {
        console.log(`🤖 Trying Gemini model: ${model}`);

        const response = await this.ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        });

        const rawText = response.text;
        
        if (!rawText || rawText.trim().length === 0) {
          throw new Error('Empty response from AI');
        }

        // Clean and return the response
        const cleanedText = this.cleanJSON(rawText);
        console.log(`✅ Successfully generated response using ${model}`);
        
        return cleanedText.trim();

      } catch (error: any) {
        lastError = error;

        // Handle rate limiting - try next model
        if (error.status === 429) {
          console.warn(`⚠️  Rate limited on ${model}, trying fallback...`);
          continue;
        }

        // Handle model not found - try next model
        if (error.status === 404) {
          console.warn(`⚠️  Model ${model} not found, trying fallback...`);
          continue;
        }

        // Log other errors and try next model
        console.warn(`⚠️  Model ${model} failed: ${error.message}`);
      }
    }

    // All models failed
    console.error('❌ All Gemini models failed:', lastError);

    // Handle specific error cases
    if (lastError?.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    }

    if (lastError?.status === 429 || lastError?.message?.includes('quota')) {
      throw new Error(
        'AI service is temporarily unavailable due to rate limits. Please try again in a moment.'
      );
    }

    if (lastError?.message?.includes('timeout')) {
      throw new Error('AI service timed out. Please try again.');
    }

    // Generic fallback error
    throw new Error(
      'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.'
    );
  }

  /**
   * Build conversation context for the AI
   * Includes system prompt and conversation history
   */
  private buildConversationContext(
    history: MessageDocument[],
    currentMessage: string
  ): string {
    let context = SYSTEM_PROMPT + '\n\n---\n\nConversation History:\n';

    // Include last 10 messages for context (to avoid token limits)
    const recentHistory = history.slice(-10);

    if (recentHistory.length === 0) {
      context += '(This is the start of the conversation)\n';
    } else {
      recentHistory.forEach((msg) => {
        const role = msg.sender === 'user' ? 'Customer' : 'Agent';
        context += `${role}: ${msg.text}\n`;
      });
    }

    context += `\nCustomer: ${currentMessage}\nAgent:`;

    return context;
  }

  /**
   * Validate user input before sending to AI
   */
  validateInput(message: string): { valid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > 2000) {
      return {
        valid: false,
        error: 'Message is too long. Please keep it under 2000 characters.',
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
