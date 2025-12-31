import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../types';

export interface MessageDocument extends IMessage, Document {
  _id: mongoose.Types.ObjectId;
}

const messageSchema = new Schema<MessageDocument>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false, // We're using our own timestamp field
  }
);

// Compound index for efficient conversation queries
messageSchema.index({ conversationId: 1, timestamp: 1 });

export const Message = mongoose.model<MessageDocument>('Message', messageSchema);
