export type InteractionType = 'login' | 'AI question' | 'document';

export interface Interaction {
  id: string;
  studentId: string;
  type: InteractionType;
  timestamp: string; // ISO 8601
  metadata?: Record<string, any>;
}

export type CreateInteractionDto = Omit<Interaction, 'id'>;