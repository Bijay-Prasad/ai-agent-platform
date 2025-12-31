import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  geminiApiKey: string;
  frontendUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chat-agent',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Validate required environment variables
if (!config.geminiApiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables');
}

if (!config.mongoUri) {
  throw new Error('MONGODB_URI is required in environment variables');
}

export default config;
