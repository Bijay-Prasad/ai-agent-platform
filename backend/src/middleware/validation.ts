import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Validation middleware for chat message requests
 */
export const validateChatMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, sessionId } = req.body;

  // Validate message
  if (message === undefined || message === null) {
    throw new AppError('Message is required', 400);
  }

  if (typeof message !== 'string') {
    throw new AppError('Message must be a string', 400);
  }

  if (message.trim().length === 0) {
    throw new AppError('Message cannot be empty', 400);
  }

  if (message.length > 2000) {
    throw new AppError('Message is too long (max 2000 characters)', 400);
  }

  // Validate sessionId if provided
  if (sessionId !== undefined && sessionId !== null) {
    if (typeof sessionId !== 'string') {
      throw new AppError('Session ID must be a string', 400);
    }

    // Basic MongoDB ObjectId format validation
    if (!/^[a-f\d]{24}$/i.test(sessionId)) {
      throw new AppError('Invalid session ID format', 400);
    }
  }

  next();
};
