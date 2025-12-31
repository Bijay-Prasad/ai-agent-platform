import mongoose, { Schema, Document } from 'mongoose';
import { IConversation } from '../types';

export interface ConversationDocument extends IConversation, Document {
  _id: mongoose.Types.ObjectId;
}

const conversationSchema = new Schema<ConversationDocument>(
  {
    metadata: {
      type: {
        userAgent: String,
        ip: String,
      },
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add indexes for better query performance
conversationSchema.index({ createdAt: -1 });

export const Conversation = mongoose.model<ConversationDocument>(
  'Conversation',
  conversationSchema
);
