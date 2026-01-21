export type InteractionType = 'login' | 'AI question' | 'document upload' | 'document download';

export interface Interaction {
  id: string;
  studentId: string;
  type: InteractionType;
  description: string;
  timestamp: string; // ISO 8601
  metadata?: Record<string, any>;
}

export type CreateInteractionDto = Omit<Interaction, 'id'>;