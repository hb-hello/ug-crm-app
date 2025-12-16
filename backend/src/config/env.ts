import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  firebase: {
    configPath: process.env.FIREBASE_CONFIG_PATH
  },
  customerIo: {
    apiKey: process.env.CUSTOMER_IO_API_KEY || '',
    siteId: process.env.CUSTOMER_IO_SITE_ID || '',
  }
};

// Validate critical environment variables
export const validateEnv = () => {
  const required = ['FIREBASE_PROJECT_ID'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default Firebase credentials...');
  }
};