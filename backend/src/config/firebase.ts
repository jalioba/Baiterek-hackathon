import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    let credential;

    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
    } else {
      const serviceAccount = require('../../serviceAccountKey.json');
      credential = admin.credential.cert(serviceAccount);
    }

    admin.initializeApp({
      credential,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.warn("⚠️ Failed to initialize Firebase Admin. Please check your .env variables or serviceAccountKey.json.");
    console.error(error);
  }
}

export const db = getFirestore();           // Firestore Admin
export const rtdb = getDatabase();          // Realtime Database Admin
export const storage = getStorage();        // Storage Admin
export const adminAuth = getAuth();         // Auth Admin
export default admin;
