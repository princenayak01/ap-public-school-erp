import dotenv from 'dotenv';
dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!accessSecret || accessSecret.length < 32) {
  throw new Error('JWT_ACCESS_SECRET must be configured with at least 32 characters.');
}
if (!refreshSecret || refreshSecret.length < 32) {
  throw new Error('JWT_REFRESH_SECRET must be configured with at least 32 characters.');
}
if (accessSecret === refreshSecret) {
  throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values.');
}

const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwt: {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || '',
    token: process.env.WHATSAPP_ACCESS_TOKEN || '',
    enabled: process.env.WHATSAPP_ENABLED === 'true',
  },
  ai: {
    apiUrl: process.env.AI_SERVICE_URL || 'https://api.openai.com/v1',
    apiKey: process.env.AI_API_KEY || '',
  },
  cors: { origin: clientOrigins },
};

export default config;
