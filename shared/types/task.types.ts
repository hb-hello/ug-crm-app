export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
  id: string;
  studentId: string;
  description: string;
  dueDate: string; // ISO 8601
  assignedTo: string;
  status: TaskStatus;
  createdBy: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type CreateTaskDto = Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskDto = Partial<Omit<Task, 'id' | 'studentId' | 'createdBy' | 'createdAt'>> & {
  id: string;
};