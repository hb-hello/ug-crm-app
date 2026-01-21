import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { db } from '../services/firestore';
import { CommunicationChannel } from 'crm-shared';

const router = express.Router();

const VALID_CHANNELS: CommunicationChannel[] = ['call', 'email', 'sms'];

/**
 * GET /api/communications
 * Fetch communications, optionally filtered by studentId
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { studentId } = req.query as { studentId?: string };

        let query = db.collection('communications');

        if (studentId) {
            query = query.where('studentId', '==', studentId) as any;
        }

        const snapshot = await query.orderBy('timestamp', 'desc').get();

        const communications = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : data.timestamp,
            };
        });

        return res.json(communications);
    } catch (error) {
        console.error('Failed to fetch communications:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /api/communications
 * Create a new communication
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { studentId, channel, summary, timestamp } = req.body;

        if (!studentId || !channel || !summary || !timestamp) {
            return res.status(400).json({ message: 'studentId, channel, summary, and timestamp are required' });
        }

        if (!VALID_CHANNELS.includes(channel)) {
            return res.status(400).json({ message: 'Invalid channel. Must be one of: call, email, sms' });
        }

        const newCommunication = {
            studentId,
            channel,
            summary,
            timestamp: new Date(timestamp),
            loggedBy: (req.user as any)?.uid,
        };

        const docRef = await db.collection('communications').add(newCommunication);

        return res.status(201).json({
            id: docRef.id,
            ...newCommunication,
            timestamp: new Date(timestamp).toISOString(),
        });
    } catch (error) {
        console.error('Failed to create communication:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;

