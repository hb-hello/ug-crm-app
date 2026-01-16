import express, { Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { db } from '../../services/firestore';
import { Student } from '../../types/firestore.types';
import { CollectionReference, Query } from 'firebase-admin/firestore';

const router = express.Router();

/**
 * GET /api/students/stats
 * Returns summary counts by status, filter options, and status sort order.
 * This endpoint is called once when the page loads, not on every filter change.
 */
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
    try {
        // Get all students for summary counts
        const summaryQuery: Query<Student> = db.collection('students') as CollectionReference<Student>;
        const summarySnapshot = await summaryQuery.get();

        const summary: Record<Student['applicationStatus'], number> = {
            Prospect: 0,
            Applying: 0,
            Submitted: 0,
            Admitted: 0,
            Rejected: 0,
            Enrolled: 0,
        };

        summarySnapshot.docs.forEach((doc) => {
            const data = doc.data() as Student;
            const status = data.applicationStatus || 'Prospect';
            summary[status] = (summary[status] || 0) + 1;
        });

        return res.json({
            summary: {
                ...summary,
                total: summarySnapshot.size,
            },
        });
    } catch (error) {
        console.error('Failed to fetch student stats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
