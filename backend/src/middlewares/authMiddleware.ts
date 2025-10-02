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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Insufficient permissions' });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
