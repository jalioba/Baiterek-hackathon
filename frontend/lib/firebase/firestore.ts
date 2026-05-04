import { getFirestore, collection, query, where, onSnapshot, doc, orderBy, updateDoc, setDoc } from 'firebase/firestore';
import { app } from './config';

// Initialize Firestore
export const db = getFirestore(app);

// Applications
export const getUserApplications = (userId: string, callback: (data: any[]) => void) => {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const apps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(apps);
  });
};

export const getApplicationById = (id: string, callback: (data: any) => void) => {
  const docRef = doc(db, 'applications', id);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  });
};

// Notifications
export const getUserNotifications = (userId: string, callback: (data: any[]) => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(notifications);
  });
};

export const markNotificationAsRead = async (id: string) => {
  const docRef = doc(db, 'notifications', id);
  await updateDoc(docRef, { isRead: true });
};

// Documents
export const saveDocument = async (data: any) => {
  const docRef = doc(collection(db, 'documents'));
  await setDoc(docRef, {
    ...data,
    createdAt: new Date(),
    status: 'UPLOADED'
  });
  return docRef.id;
};

export const getApplicationDocuments = (applicationId: string, callback: (data: any[]) => void) => {
  const q = query(
    collection(db, 'documents'),
    where('applicationId', '==', applicationId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(docs);
  });
};
