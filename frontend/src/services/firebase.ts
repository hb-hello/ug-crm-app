// /frontend/services/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from 'firebase/auth';

/**
 * ✅ Validate required Firebase env vars at runtime
 */
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

requiredEnvVars.forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`❌ Missing Firebase environment variable: ${key}`);
  }
});

// ✅ Firebase config from Vite env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ✅ Initialize Firebase app (guarded for hot reloads in dev)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Init Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * 🔐 Sign in with Google popup
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * 🚪 Sign out
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

/**
 * 👤 Listen to auth state changes
 */
export const onAuthStateChanged = (
  callback: (user: User | null) => void
) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

export { auth };
