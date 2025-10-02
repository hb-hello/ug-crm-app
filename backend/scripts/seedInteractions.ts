import { db } from '../src/services/firestore';
import { Interaction } from '../src/types/firestore.types';
import { Timestamp } from 'firebase-admin/firestore';

const interactions: Omit<Interaction, 'id'>[] = [
  {
    studentId: 'student_doc_id_1', // Replace with actual ID from seeded students
    type: 'login',
    timestamp: Timestamp.now(),
    metadata: { device: 'mobile' },
  },
  {
    studentId: 'student_doc_id_2',
    type: 'AI question',
    timestamp: Timestamp.now(),
    metadata: { question: 'How to apply to MIT?' },
  },
];

async function seedInteractions() {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('interactions');

    interactions.forEach((interaction) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, interaction);
    });

    await batch.commit();
    console.log('✅ Interactions seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding interactions:', error);
  }
}

seedInteractions();
