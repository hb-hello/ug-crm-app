import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ Missing or invalid Authorization header');
    console.log('Received headers:', req.headers);
    res.status(401).json({
      message: 'Unauthorized: Missing or invalid Authorization header'
    });
    return; // Explicit return
  }

  const idToken = authHeader.split('Bearer ')[1].trim();
  console.log('🔑 Received token (first 20 chars):', idToken.substring(0, 20) + '...');

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('✅ Token verified for user:', decodedToken.email);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('❌ Error verifying Firebase ID token:', error);
    res.status(401).json({
      message: 'Unauthorized: Invalid token'
    });
    return; // Explicit return
  }
};