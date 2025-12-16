export type NoteVisibility = 'public' | 'private';

export interface Note {
  id: string;
  studentId: string;
  content: string; // Rich text HTML or markdown
  visibility: NoteVisibility;
  createdBy: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type CreateNoteDto = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoteDto = Partial<Pick<Note, 'content' | 'visibility'>> & {
  id: string;
};