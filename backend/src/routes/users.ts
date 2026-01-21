import { Router, Request, Response } from 'express';
import { collections } from '../services/firestore';
import { authMiddleware } from '../middlewares/authMiddleware';
import { Timestamp } from 'firebase-admin/firestore';
import type { CreateUserDto } from 'crm-shared';

const router = Router();

// Create a new user (Post-Signup)
// Create a new user (Post-Signup)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { name, role } = req.body as CreateUserDto;
        const { uid, email } = req.user!; // From authMiddleware

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'User email is required from auth token',
            });
        }

        // Check if user already exists
        const userDoc = await collections.users.doc(uid).get();
        if (userDoc.exists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists',
            });
        }

        const newUser = {
            id: uid,
            email,
            name: name || email.split('@')[0], // Fallback to email prefix if no name
            role: role || 'user',
            createdAt: Timestamp.now(),
        };

        await collections.users.doc(uid).set(newUser);

        return res.status(201).json({
            success: true,
            data: {
                ...newUser,
                createdAt: newUser.createdAt.toDate().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create user',
        });
    }
});

// Get current user profile
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { uid } = req.user!;
        const userDoc = await collections.users.doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found',
            });
        }

        const userData = userDoc.data()!;

        return res.json({
            success: true,
            data: {
                ...userData,
                createdAt: userData.createdAt.toDate().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
        });
    }
});

// Get all users (lightweight for mapping)
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
    try {
        const snapshot = await collections.users.get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || data.email, // Fallback to email if name missing
                email: data.email,
                role: data.role,
            };
        });

        return res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
        });
    }
});

export default router;
