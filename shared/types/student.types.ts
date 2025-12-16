// Note: Frontend uses Date objects, Backend uses Firestore Timestamps
// We use string (ISO 8601) as the transfer format between them

export type ApplicationStatus =
  | 'prospect'
  | 'applying'
  | 'submitted'
  | 'admitted'
  | 'rejected'
  | 'enrolled';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  country: string;
  applicationStatus: ApplicationStatus;
  lastActive: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
  tags: string[];
  applyingColleges?: string[];
  submittedColleges?: string[];
  countCommunications: number;
  countPendingTasks: number;
}

// For creating a new student (no id, dates, or counts)
export type CreateStudentDto = Omit<
  Student,
  'id' | 'lastActive' | 'createdAt' | 'countCommunications' | 'countPendingTasks'
>;

// For updating a student (all fields optional except id)
export type UpdateStudentDto = Partial<Omit<Student, 'id' | 'createdAt'>> & {
  id: string;
};