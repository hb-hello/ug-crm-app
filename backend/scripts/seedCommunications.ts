import { db } from '../src/services/firestore';
import { Communication } from '../src/types/firestore.types';
import { Timestamp } from 'firebase-admin/firestore';

const communications: Omit<Communication, 'id'>[] = [
  {
    studentId: 'student_doc_id_1',
    channel: 'email',
    summary: 'Follow-up email about application status',
    timestamp: Timestamp.now(),
    loggedBy: 'adminUser1',
  },
  {
    studentId: 'student_doc_id_2',
    channel: 'call',
    summary: 'Initial consultation call',
    timestamp: Timestamp.now(),
    loggedBy: 'adminUser2',
  },
];

async function seedCommunications() {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('communications');

    communications.forEach((item) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, item);
    });

    await batch.commit();
    console.log('✅ Communications seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding communications:', error);
  }
}

seedCommunications();
