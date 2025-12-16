import { Timestamp } from 'firebase-admin/firestore';
import type { Student as FirestoreStudent } from '../types/firestore.types';
import type { Student as ApiStudent } from 'crm-shared';

export const studentConverter = {
  // Convert Firestore doc to API response
  toApi: (firestoreStudent: FirestoreStudent): ApiStudent => ({
    ...firestoreStudent,
    lastActive: firestoreStudent.lastActive.toDate().toISOString(),
    createdAt: firestoreStudent.createdAt.toDate().toISOString(),
  }),

  // Convert API request to Firestore doc
  toFirestore: (apiStudent: Partial<ApiStudent>): Partial<FirestoreStudent> => {
    const doc: any = { ...apiStudent };

    if (apiStudent.lastActive) {
      doc.lastActive = Timestamp.fromDate(new Date(apiStudent.lastActive));
    }
    if (apiStudent.createdAt) {
      doc.createdAt = Timestamp.fromDate(new Date(apiStudent.createdAt));
    }

    return doc;
  },
};

// Similar converters for other types...
export const taskConverter = {
  toApi: (firestoreTask: any) => ({
    ...firestoreTask,
    dueDate: firestoreTask.dueDate.toDate().toISOString(),
    createdAt: firestoreTask.createdAt.toDate().toISOString(),
    updatedAt: firestoreTask.updatedAt.toDate().toISOString(),
  }),

  toFirestore: (apiTask: any) => {
    const doc: any = { ...apiTask };
    if (apiTask.dueDate) doc.dueDate = Timestamp.fromDate(new Date(apiTask.dueDate));
    if (apiTask.createdAt) doc.createdAt = Timestamp.fromDate(new Date(apiTask.createdAt));
    if (apiTask.updatedAt) doc.updatedAt = Timestamp.fromDate(new Date(apiTask.updatedAt));
    return doc;
  },
};