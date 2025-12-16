import { Timestamp } from 'firebase-admin/firestore';
import type {
  Student as SharedStudent,
  Interaction as SharedInteraction,
  Communication as SharedCommunication,
  Note as SharedNote,
  Task as SharedTask,
} from 'crm-shared';

// Backend uses Firestore Timestamps
export interface Student extends Omit<SharedStudent, 'lastActive' | 'createdAt'> {
  lastActive: Timestamp;
  createdAt: Timestamp;
}

export interface Interaction extends Omit<SharedInteraction, 'timestamp'> {
  timestamp: Timestamp;
}

export interface Communication extends Omit<SharedCommunication, 'timestamp'> {
  timestamp: Timestamp;
}

export interface Note extends Omit<SharedNote, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Task extends Omit<SharedTask, 'dueDate' | 'createdAt' | 'updatedAt'> {
  dueDate: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}