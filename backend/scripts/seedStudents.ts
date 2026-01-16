import { db } from '../src/services/firestore';
import { Student } from '../src/types/firestore.types';
import { Timestamp } from 'firebase-admin/firestore';

const generateRandomId = () => Math.floor(100000 + Math.random() * 900000).toString();

const students: Omit<Student, 'id'>[] = [
  {
    studentId: `UG-${generateRandomId()}`,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567890',
    grade: '12',
    country: 'USA',
    applicationStatus: 'Applying',
    lastActive: Timestamp.now(),
    createdAt: Timestamp.now(),
    tags: ['Interested'],
    applyingColleges: ['Harvard', 'Stanford'],
    submittedColleges: [],
    countCommunications: 2,
    countPendingTasks: 1,
  },
  {
    studentId: `UG-${generateRandomId()}`,
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '+1987654321',
    grade: '11',
    country: 'Canada',
    applicationStatus: 'Prospect',
    lastActive: Timestamp.now(),
    createdAt: Timestamp.now(),
    tags: ['Cold'],
    applyingColleges: [],
    submittedColleges: [],
    countCommunications: 0,
    countPendingTasks: 2,
  },
];

async function seedStudents() {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('students');

    students.forEach((student) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, {
        ...student,
        id: docRef.id,
      });
    });

    await batch.commit();
    console.log('✅ Students seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding students:', error);
  }
}

seedStudents();
