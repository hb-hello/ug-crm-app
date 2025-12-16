import { config } from '../config/env';
import admin from 'firebase-admin';
import * as path from 'path';

let firebaseApp: admin.app.App;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    const serviceAccountPath = path.join(
      __dirname,
      config.firebase.configPath || '../config/keys/serviceAccountKey.json'
    );

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    console.log('Firebase Admin initialized');
  }
  return firebaseApp;
};

export const getFirebaseAuth = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
};

export const getFirestore = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.firestore();
};