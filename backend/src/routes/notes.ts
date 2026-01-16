import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { db } from '../services/firestore';

const router = express.Router();

/**
 * GET /api/notes
 * Fetch notes, optionally filtered by studentId
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { studentId } = req.query as { studentId?: string };

        let query = db.collection('notes');

        if (studentId) {
            query = query.where('studentId', '==', studentId) as any;
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();

        const notes = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            };
        });

        return res.json(notes);
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
