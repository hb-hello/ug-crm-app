import type { CommunicationChannel } from './communication.types';
import type { TaskStatus } from './task.types';

export interface GlobalConfig {
  tags: string[]; // e.g. ['High Intent', 'Unresponsive', ...]
  communicationTypes: CommunicationChannel[];
  taskStatuses: TaskStatus[];
  defaultReminderDays: number;
  studentStatusSortOrder: string[]; // e.g. ['applying', 'submitted', 'admitted', 'rejected', 'enrolled']
}

export type EmailTemplateType =
  | 'follow_up'
  | 'reminder'
  | 'introduction'
  | 'custom';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // HTML content
  type: EmailTemplateType;
}

export type CreateEmailTemplateDto = Omit<EmailTemplate, 'id'>;