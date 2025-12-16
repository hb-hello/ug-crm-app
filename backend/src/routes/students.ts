import express, { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { db } from '../services/firestore';
import { Student } from '../types/firestore.types';
import { CollectionReference, Query } from 'firebase-admin/firestore';

const router = express.Router();

const PAGE_LIMIT = 20;

router.get('/api/students', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      cursor,
      country,
      tags,
      applicationStatus,
      search,
      sort = 'name',
    } = req.query as {
      cursor?: string;
      country?: string;
      tags?: string | string[];
      applicationStatus?: Student['applicationStatus'];
      search?: string;
      sort?: 'name' | 'lastActive';
    };

    let query = db.collection('students').limit(PAGE_LIMIT);

    // Filtering
    if (country) {
      query = query.where('country', '==', country);
    }

    if (applicationStatus) {
      query = query.where('applicationStatus', '==', applicationStatus);
    }

    if (tags) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagsArray.length) {
        query = query.where('tags', 'array-contains-any', tagsArray);
      }
    }

    // Sorting and search
    const allowedSortFields = ['name', 'lastActive'];
    const orderByField = allowedSortFields.includes(sort) ? sort : 'name';

    query = query.orderBy(orderByField);

    if (cursor) {
      const cursorDoc = await db.collection('students').doc(cursor).get();
      if (!cursorDoc.exists) {
        return res.status(400).json({ message: 'Invalid cursor' });
      }
      const cursorData = cursorDoc.data() as Student | undefined;
      if (!cursorData) {
        return res.status(400).json({ message: 'Invalid cursor data' });
      }
      const cursorValue = cursorData[orderByField];
      if (cursorValue === undefined) {
        return res.status(400).json({ message: `Cursor document missing orderBy field: ${orderByField}` });
      }
      query = query.startAfter(cursorValue);
    }

    if (search) {
      if (orderByField === 'name') {
        query = query
          .startAt(search)
          .endAt(search + '\uf8ff');
      }
    }

    const snapshot = await query.get();

    const students: Student[] = snapshot.docs.map((doc) => ({
      // id: doc.id,
      ...(doc.data() as Student),
    }));

    const nextCursor = students.length === PAGE_LIMIT ? students[students.length - 1].id || null : null;

    // Summary counts by applicationStatus
    let summaryQuery: Query<Student> = db.collection('students') as CollectionReference<Student>;

    if (country) {
      summaryQuery = summaryQuery.where('country', '==', country);
    }

    if (tags) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (tagsArray.length) {
        summaryQuery = summaryQuery.where('tags', 'array-contains-any', tagsArray);
      }
    }

    // For summary, ignore applicationStatus filter to get counts by status for filtered students

    const summarySnapshot = await summaryQuery.get();

    const summary: Record<Student['applicationStatus'], number> = {
      prospect: 0,
      applying: 0,
      submitted: 0,
      admitted: 0,
      rejected: 0,
      enrolled: 0,
    };

    summarySnapshot.docs.forEach((doc) => {
      const data = doc.data() as Student;
      const status = data.applicationStatus || 'prospect'; // default fallback
      summary[status] = (summary[status] || 0) + 1;
    });

    return res.json({
      students,
      nextCursor,
      summary,
    });
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
