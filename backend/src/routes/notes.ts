import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { db } from '../services/firestore';
import { FieldValue } from 'firebase-admin/firestore';

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

/**
 * POST /api/notes
 * Create a new note
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { studentId, content } = req.body;
        // @ts-ignore - user is attached by authMiddleware
        const currentUser = req.user;

        if (!studentId || !content) {
            return res.status(400).json({ message: 'Student ID and content are required' });
        }

        const newNote = {
            studentId,
            content,
            createdBy: currentUser?.uid,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection('notes').add(newNote);

        return res.status(201).json({
            id: docRef.id,
            ...newNote,
            createdAt: new Date().toISOString(), // Approximate for immediate response
        });
    } catch (error) {
        console.error('Failed to create note:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * PATCH /api/notes/:id
 * Update a note
 */
router.patch('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        // @ts-ignore
        const currentUser = req.user;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const noteRef = db.collection('notes').doc(id);
        const noteDoc = await noteRef.get();

        if (!noteDoc.exists) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const noteData = noteDoc.data();

        // Check if current user is the creator
        if (noteData?.createdBy !== currentUser?.uid && noteData?.createdBy !== currentUser?.user_id) {
            // Fallback for older data or different auth claims
            return res.status(403).json({ message: 'Unauthorized to edit this note' });
        }

        await noteRef.update({
            content,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return res.json({ id, content, message: 'Note updated successfully' });
    } catch (error) {
        console.error('Failed to update note:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const currentUser = req.user;

        const noteRef = db.collection('notes').doc(id);
        const noteDoc = await noteRef.get();

        if (!noteDoc.exists) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const noteData = noteDoc.data();

        // Check if current user is the creator
        if (noteData?.createdBy !== currentUser?.uid && noteData?.createdBy !== currentUser?.user_id) {
            return res.status(403).json({ message: 'Unauthorized to delete this note' });
        }

        await noteRef.delete();

        return res.json({ id, message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Failed to delete note:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
