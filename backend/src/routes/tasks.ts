import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { db } from '../services/firestore';
import { FieldValue } from 'firebase-admin/firestore';

const router = express.Router();

/**
 * GET /api/tasks
 * Fetch tasks, optionally filtered by studentId
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { studentId } = req.query as { studentId?: string };

        let query = db.collection('tasks');

        if (studentId) {
            query = query.where('studentId', '==', studentId) as any;
        }

        const snapshot = await query.orderBy('createdAt', 'desc').get();

        const tasks = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
                updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
                dueDate: data.dueDate?.toDate?.() ? data.dueDate.toDate().toISOString() : data.dueDate,
            };
        });

        return res.json(tasks);
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * PATCH /api/tasks/:id
 * Update task status
 */
router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const taskRef = db.collection('tasks').doc(id);
        const taskDoc = await taskRef.get();

        if (!taskDoc.exists) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await taskRef.update({
            status,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return res.json({ id, status, message: 'Task updated successfully' });
    } catch (error) {
        console.error('Failed to update task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
