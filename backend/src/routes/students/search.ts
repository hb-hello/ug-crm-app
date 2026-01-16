import express, { Request, Response } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { db, configDocs } from '../../services/firestore';
import { Student } from '../../types/firestore.types';
import type { GlobalConfig } from 'crm-shared';

const router = express.Router();

const PAGE_LIMIT = 20;

/**
 * GET /api/students/search
 * Returns paginated student list based on filters.
 * Called on every filter/search/pagination change.
 */
router.get('/search', authMiddleware, async (req: Request, res: Response) => {
    try {
        const {
            cursor,
            country,
            tags,
            status,
            search,
            sort = 'name',
        } = req.query as {
            cursor?: string;
            country?: string;
            tags?: string | string[];
            status?: Student['applicationStatus'];
            search?: string;
            sort?: 'name' | 'lastActive';
        };

        let query = db.collection('students').limit(PAGE_LIMIT);

        // Filtering
        if (country) {
            query = query.where('country', '==', country);
        }

        if (status) {
            query = query.where('applicationStatus', '==', status);
        }

        if (tags) {
            const tagsArray = Array.isArray(tags)
                ? tags
                : tags.split(',').map((t) => t.trim()).filter(Boolean);
            if (tagsArray.length) {
                query = query.where('tags', 'array-contains-any', tagsArray);
            }
        }

        // Sorting
        const allowedSortFields = ['name', 'lastActive'];
        const orderByField = allowedSortFields.includes(sort) ? sort : 'name';
        query = query.orderBy(orderByField);

        // Cursor-based pagination
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

        // Search (prefix match on name)
        if (search) {
            if (orderByField === 'name') {
                query = query.startAt(search).endAt(search + '\uf8ff');
            }
        }

        const snapshot = await query.get();

        const students = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                lastActive: data.lastActive?.toDate?.() ? data.lastActive.toDate().toISOString() : data.lastActive,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
            };
        });

        const nextCursor = students.length === PAGE_LIMIT ? students[students.length - 1].id || null : null;

        // Calculate filter options (Aggregating all documents to get distinct values)
        // Note: For better performance in large collections, keep distinct values in a separate 'metadata' document
        const summaryQuery = db.collection('students');
        const summarySnapshot = await summaryQuery.get();

        const allStatuses = new Set<string>();
        const allCountries = new Set<string>();

        summarySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.applicationStatus) allStatuses.add(data.applicationStatus);
            if (data.country) allCountries.add(data.country);
        });

        const globalConfigDoc = await configDocs.global.get();
        const globalConfig = globalConfigDoc.data() as GlobalConfig | undefined;

        // Sort statuses based on config order
        const sortOrder = globalConfig?.studentStatusSortOrder ?? [];
        const sortedStatuses = Array.from(allStatuses).sort((a, b) => {
            const indexA = sortOrder.indexOf(a);
            const indexB = sortOrder.indexOf(b);
            // If both found, sort by index
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // If only a found, a comes first
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            // If neither, sort alphabetically
            return a.localeCompare(b);
        });

        const filterOptions = {
            tags: globalConfig?.tags ?? [],
            statuses: sortedStatuses,
            countries: Array.from(allCountries).sort(),
        };

        return res.json({
            students,
            pagination: {
                hasNextPage: !!nextCursor,
                nextCursor,
            },
            filterOptions,
        });
    } catch (error) {
        console.error('Failed to search students:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
