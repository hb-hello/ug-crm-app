// Import Firestore Timestamp type
import { Timestamp } from 'firebase-admin/firestore';

// ========== STUDENTS COLLECTION ==========
export interface Student {
  id?: string; // Firestore doc ID (optional in case it's inferred separately)
  name: string;
  email: string;
  phone: string;
  grade: string;
  country: string;
  applicationStatus: 'prospect' | 'applying' | 'submitted' | 'admitted' | 'rejected' | 'enrolled';
  lastActive: Timestamp;
  createdAt: Timestamp;
  tags: string[];
  applyingColleges?: string[]; // Only during applying stage
  submittedColleges?: string[]; // Only during submitted stage
  countCommunications: number;
  countPendingTasks: number;
}

// ========== INTERACTIONS COLLECTION ==========
export type InteractionType = 'login' | 'AI question' | 'document';

export interface Interaction {
  id?: string;
  studentId: string;
  type: InteractionType;
  timestamp: Timestamp;
  metadata?: Record<string, any>; // Flexible metadata depending on interaction
}

// ========== COMMUNICATIONS COLLECTION ==========
export type CommunicationChannel = 'call' | 'email' | 'sms';

export interface Communication {
  id?: string;
  studentId: string;
  channel: CommunicationChannel;
  summary: string;
  timestamp: Timestamp;
  loggedBy: string; // userId or staffId
}

// ========== NOTES COLLECTION ==========
export type NoteVisibility = 'public' | 'private';

export interface Note {
  id?: string;
  studentId: string;
  content: string; // Rich text HTML or serialized format
  visibility: NoteVisibility;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ========== TASKS COLLECTION ==========
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
  id?: string;
  studentId: string;
  description: string;
  dueDate: Timestamp;
  assignedTo: string;
  status: TaskStatus;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ========== /config/global DOCUMENT ==========
export interface GlobalConfig {
  tags: string[]; // e.g. ['High Intent', 'Unresponsive', ...]
  communicationTypes: CommunicationChannel[]; // Ensures consistency
  taskStatuses: TaskStatus[]; // Ensures consistency
  defaultReminderDays: number;
}

// ========== /config/emailTemplates COLLECTION ==========
export type EmailTemplateType = 'follow_up' | 'reminder' | 'introduction' | 'custom'; // Expand as needed

export interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  body: string; // HTML content
  type: EmailTemplateType;
}