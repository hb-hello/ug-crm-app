export type CommunicationChannel = 'call' | 'email' | 'sms';

export interface Communication {
  id: string;
  studentId: string;
  channel: CommunicationChannel;
  summary: string;
  timestamp: string; // ISO 8601
  loggedBy: string; // userId or staffId
}

export type CreateCommunicationDto = Omit<Communication, 'id'>;