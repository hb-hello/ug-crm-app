import { db } from '../src/services/firestore';
import { Note } from '../src/types/firestore.types';
import { Timestamp } from 'firebase-admin/firestore';

const notes: Omit<Note, 'id'>[] = [
  {
    studentId: 'student_doc_id_1',
    content: '<p>Needs help with essays</p>',
    visibility: 'private',
    createdBy: 'adminUser1',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

async function seedNotes() {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('notes');

    notes.forEach((note) => {
      const docRef = collectionRef.doc();
      batch.set(docRef, note);
    });

    await batch.commit();
    console.log('✅ Notes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding notes:', error);
  }
}

seedNotes();
