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

async function initGlobalConfig() {
    try {
        const configRef = db.doc('config/global');
        await configRef.set(globalConfigData, { merge: true });
        console.log('✅ Global config seeded successfully at /config/global');
    } catch (error) {
        console.error('❌ Failed to seed global config:', error);
        process.exit(1);
    }
}

// 🚀 Run
initGlobalConfig();