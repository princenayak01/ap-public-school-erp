import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'apps_jhansi_default_access_secret_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'apps_jhansi_default_refresh_secret_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_school_dummy_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_school_dummy_secret',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'apps_rzp_webhook_secret_2026',
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
  cors: {
    origin: (process.env.CLIENT_ORIGIN || 'http://localhost:3000,http://localhost:5000').split(','),
  },
};

export default config;
