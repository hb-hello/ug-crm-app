import express, { Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { db } from '../../services/firestore';
import { Student } from '../../types/firestore.types';

const router = express.Router();

/**
 * GET /api/students/:id
 * Fetch a single student by studentId (custom ID)
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Query by studentId field first
        const snapshot = await db.collection('students').where('studentId', '==', id).limit(1).get();

        if (snapshot.empty) {
            // Fallback: try to find by document ID if not found by studentId field
            const docRef = await db.collection('students').doc(id).get();
            if (!docRef.exists) {
                return res.status(404).json({ message: 'Student not found' });
            }
            const data = docRef.data() as Student;
            return res.json({
                ...data,
                id: docRef.id,
                lastActive: data.lastActive?.toDate?.() ? data.lastActive.toDate().toISOString() : data.lastActive,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
            });
        }

        const doc = snapshot.docs[0];
        const data = doc.data() as Student;

        return res.json({
            ...data,
            id: doc.id,
            lastActive: data.lastActive?.toDate?.() ? data.lastActive.toDate().toISOString() : data.lastActive,
            createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        });
    } catch (error) {
        console.error('Failed to fetch student:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
