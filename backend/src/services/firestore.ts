import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { config } from '../config/env';
import type {
  Student,
  Interaction,
  Communication,
  Note,
  Task,
} from '../types/firestore.types';
import type { GlobalConfig, EmailTemplate } from 'crm-shared';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;

export const initializeFirebase = (): admin.app.App => {

  if (!firebaseApp) {
    try {
      // Try to use service account credentials from environment
      if (
        config.firebase.configPath
      ) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(require(config.firebase.configPath)),
        });
        console.log('✅ Firebase Admin initialized with service account');
      } else {
        // Fallback to default credentials (useful for Cloud Run, App Engine, etc.)
        firebaseApp = admin.initializeApp();
        console.log('✅ Firebase Admin initialized with default credentials');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin:', error);
      throw error;
    }
  }
  return firebaseApp;
};

// Initialize Firestore
export const db = getFirestore(initializeFirebase());

// Export typed collection references
export const collections = {
  students: db.collection('students') as FirebaseFirestore.CollectionReference<Student>,
  interactions: db.collection('interactions') as FirebaseFirestore.CollectionReference<Interaction>,
  communications: db.collection('communications') as FirebaseFirestore.CollectionReference<Communication>,
  notes: db.collection('notes') as FirebaseFirestore.CollectionReference<Note>,
  tasks: db.collection('tasks') as FirebaseFirestore.CollectionReference<Task>,
};

// Export typed document references for config
export const configDocs = {
  global: db.collection('config').doc('global') as FirebaseFirestore.DocumentReference<GlobalConfig>,
  emailTemplates: db.collection('config').doc('emailTemplates') as FirebaseFirestore.DocumentReference<EmailTemplate>,
};

// Helper function to get Firebase Auth
export const getAuth = () => admin.auth();

// Helper function to get a collection by name (useful for dynamic queries)
export const getCollection = (collectionName: string) => {
  return db.collection(collectionName);
};