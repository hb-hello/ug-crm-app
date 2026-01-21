// initConfig.ts
import { db } from '../src/services/firestore';
import type {
    GlobalConfig,
    CommunicationChannel,
    TaskStatus,
} from 'crm-shared';

// === 🔧 Seed Data Using Typed Constants ===
const globalConfigData: GlobalConfig = {
    tags: ['Interested', 'Needs Follow-up', 'Cold'],
    communicationTypes: ['email', 'call', 'sms'] as CommunicationChannel[],
    taskStatuses: ['pending', 'in_progress', 'completed', 'overdue'] as TaskStatus[],
    defaultReminderDays: 3,
    studentStatusSortOrder: ['Prospect', 'Applying', 'Submitted', 'Admitted', 'Rejected', 'Enrolled'],
};

// Static users
const staticUsers = [
    {
        id: 'admin-user-id', // In real app, this would be a real UID from Firebase Auth
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
    },
    {
        id: 'counselor-user-id',
        email: 'counselor@example.com',
        name: 'Counselor User',
        role: 'user',
        createdAt: new Date(),
    }
];

async function initGlobalConfig() {
    try {
        const configRef = db.doc('config/global');
        await configRef.set(globalConfigData, { merge: true });
        console.log('✅ Global config seeded successfully at /config/global');

        // Seed users
        for (const user of staticUsers) {
            await db.collection('users').doc(user.id).set(user, { merge: true });
        }
        console.log('✅ Static users seeded');

    } catch (error) {
        console.error('❌ Failed to seed global config:', error);
        process.exit(1);
    }
}

// 🚀 Run
initGlobalConfig();