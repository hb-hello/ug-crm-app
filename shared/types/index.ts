import { Student } from './student.types';

// Student types
export type { Student, CreateStudentDto, UpdateStudentDto } from './student.types';
export type { ApplicationStatus } from './student.types';

// Interaction types
export type { Interaction, CreateInteractionDto } from './interaction.types';
export type { InteractionType } from './interaction.types';

// Communication types
export type { Communication, CreateCommunicationDto } from './communication.types';
export type { CommunicationChannel } from './communication.types';

// Note types
export type { Note, CreateNoteDto, UpdateNoteDto } from './note.types';
export type { NoteVisibility } from './note.types';

// Task types
export type { Task, CreateTaskDto, UpdateTaskDto } from './task.types';
export type { TaskStatus } from './task.types';

// Config types
export type { GlobalConfig, EmailTemplate, CreateEmailTemplateDto } from './config.types';
export type { EmailTemplateType } from './config.types';

// User types
export type { User, CreateUserDto, UserRole } from './user.types';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
  };
}

export interface StudentDirectoryResponse {
  students: Student[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
  };
  summary: {
    total: number;
    prospect: number;
    applying: number;
    submitted: number;
    admitted: number;
    rejected: number;
    enrolled: number;
  };
}