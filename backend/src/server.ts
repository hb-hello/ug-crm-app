import app from './app';
import { config, validateEnv } from './config/env';
import { initializeFirebase } from './services/firestore';

// Validate environment variables
validateEnv();

// Initialize Firebase
initializeFirebase();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});