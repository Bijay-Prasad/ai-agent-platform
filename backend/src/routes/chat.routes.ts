import { Router, Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { asyncHandler } from '../middleware/errorHandler';
import { validateChatMessage } from '../middleware/validation';
import { ChatRequest, ChatResponse } from '../types';

const router = Router();

/**
 * POST /api/chat/message
 * Send a message and receive AI response
 */
router.post(
  '/message',
  validateChatMessage,
  asyncHandler(async (req: Request, res: Response) => {
    const chatRequest: ChatRequest = {
      message: req.body.message,
      sessionId: req.body.sessionId,
    };

    const response: ChatResponse = await chatService.processMessage(chatRequest);

    res.status(200).json(response);
  })
);

/**
 * GET /api/chat/conversations/:id
 * Get conversation history by ID
 */
router.get(
  '/conversations/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const conversationId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!/^[a-f\d]{24}$/i.test(conversationId)) {
      return res.status(400).json({
        error: 'Invalid conversation ID format',
      });
    }

    const result = await chatService.getConversation(conversationId);

    res.status(200).json(result);
  })
);

export default router;
