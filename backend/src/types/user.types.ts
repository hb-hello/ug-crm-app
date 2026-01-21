import { Timestamp } from 'firebase-admin/firestore';
import type { User as SharedUser } from 'crm-shared';

export interface User extends Omit<SharedUser, 'createdAt'> {
    createdAt: Timestamp;
}
