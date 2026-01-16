import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { db } from '../services/firestore';

const router = express.Router();

/**
 * GET /api/interactions
 * Fetch interactions, optionally filtered by studentId
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { studentId } = req.query as { studentId?: string };

        let query = db.collection('interactions');

        if (studentId) {
            query = query.where('studentId', '==', studentId) as any;
        }

        const snapshot = await query.orderBy('timestamp', 'desc').get();

        const interactions = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : data.timestamp,
            };
        });

        return res.json(interactions);
    } catch (error) {
        console.error('Failed to fetch interactions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
