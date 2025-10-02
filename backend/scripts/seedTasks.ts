import { db } from '../src/services/firestore';
import { Task } from '../src/types/firestore.types';
import { Timestamp } from 'firebase-admin/firestore';

const tasks: Omit<Task, 'id'>[] = [
  {
    studentId: 'student_doc_id_1',
    description: 'Submit application essay',
    dueDate: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
    assignedTo: 'counselor1',
    status: 'pending',
    createdBy: 'adminUser1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function seedTasks() {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('tasks');

    tasks.forEach((task) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, task);
    });

    await batch.commit();
    console.log('✅ Tasks seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
  }
}

seedTasks();
