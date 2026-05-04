import { db } from '../config/firebase';
import { FieldValue, Timestamp, Query } from 'firebase-admin/firestore';

// ════════════════════════════════════════
// USERS
// ════════════════════════════════════════

export const getUserById = async (uid: string) => {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const updateUserProfile = async (uid: string, data: Record<string, any>) => {
  await db.collection('users').doc(uid).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
};

export const getAllUsers = async () => {
  const snap = await db.collection('users').orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ════════════════════════════════════════
// SERVICES
// ════════════════════════════════════════

export const getServices = async (filters: {
  category?: string;
  subsidiaryId?: string;
  targetAudience?: string;
  isFeatured?: boolean;
  search?: string;
  limitCount?: number;
  sortBy?: string;
}) => {
  let q: Query = db.collection('services').where('isActive', '==', true);
  
  if (filters.category) q = q.where('category', '==', filters.category);
  if (filters.subsidiaryId) q = q.where('subsidiaryId', '==', filters.subsidiaryId);
  if (filters.isFeatured) q = q.where('isFeatured', '==', true);
  
  if (filters.sortBy === 'popular') {
    q = q.orderBy('viewCount', 'desc');
  } else {
    q = q.orderBy('createdAt', 'desc');
  }
  
  if (filters.limitCount) q = q.limit(filters.limitCount);
  
  const snap = await q.get();
  let results = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  
  // Поиск по тексту — Firestore не поддерживает полнотекстовый поиск,
  // поэтому фильтруем на стороне сервера
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(s =>
      s.title.toLowerCase().includes(searchLower) ||
      s.description.toLowerCase().includes(searchLower)
    );
  }
  
  return results;
};

export const getServiceById = async (id: string) => {
  const doc = await db.collection('services').doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const incrementServiceView = async (id: string) => {
  await db.collection('services').doc(id).update({
    viewCount: FieldValue.increment(1),
  });
};

export const createService = async (data: Record<string, any>) => {
  const ref = await db.collection('services').add({
    ...data,
    viewCount: 0,
    isActive: true,
    isFeatured: false,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
};

export const updateService = async (id: string, data: Record<string, any>) => {
  await db.collection('services').doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
};

// ════════════════════════════════════════
// APPLICATIONS
// ════════════════════════════════════════

export const createApplication = async (data: Record<string, any>) => {
  const number = `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  
  const ref = await db.collection('applications').add({
    ...data,
    number,
    status: 'DRAFT',
    bpmId: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  
  // Записываем начало истории статусов
  await db
    .collection('applications')
    .doc(ref.id)
    .collection('statusHistory')
    .add({
      status: 'DRAFT',
      comment: 'Заявка создана',
      createdAt: FieldValue.serverTimestamp(),
    });
  
  return { id: ref.id, number };
};

export const getApplicationById = async (id: string) => {
  const doc = await db.collection('applications').doc(id).get();
  if (!doc.exists) return null;
  
  // Получаем историю статусов из subcollection
  const historySnap = await db
    .collection('applications')
    .doc(id)
    .collection('statusHistory')
    .orderBy('createdAt', 'asc')
    .get();
  
  const statusHistory = historySnap.docs.map(d => ({ id: d.id, ...d.data() }));
  
  return { id: doc.id, ...doc.data(), statusHistory };
};

export const getUserApplications = async (userId: string) => {
  const snap = await db
    .collection('applications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllApplications = async (filters?: {
  status?: string;
  subsidiaryId?: string;
  limit?: number;
}) => {
  let q: Query = db.collection('applications');
  if (filters?.status) q = q.where('status', '==', filters.status);
  q = q.orderBy('createdAt', 'desc');
  if (filters?.limit) q = q.limit(filters.limit);
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateApplicationStatus = async (
  id: string,
  status: string,
  comment: string = '',
  extra: Record<string, any> = {}
) => {
  const batch = db.batch();
  
  // Обновляем основной документ
  batch.update(db.collection('applications').doc(id), {
    status,
    ...extra,
    updatedAt: FieldValue.serverTimestamp(),
  });
  
  // Добавляем в историю (subcollection)
  const historyRef = db
    .collection('applications')
    .doc(id)
    .collection('statusHistory')
    .doc();
  batch.set(historyRef, {
    status,
    comment,
    createdAt: FieldValue.serverTimestamp(),
  });
  
  await batch.commit();
};

// ════════════════════════════════════════
// DOCUMENTS
// ════════════════════════════════════════

export const saveDocumentMeta = async (data: Record<string, any>) => {
  const ref = await db.collection('documents').add({
    ...data,
    status: 'UPLOADED',
    createdAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
};

export const getUserDocuments = async (userId: string) => {
  const snap = await db
    .collection('documents')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateDocumentStatus = async (id: string, status: string, signedAt?: Date) => {
  await db.collection('documents').doc(id).update({
    status,
    ...(signedAt && { signedAt: Timestamp.fromDate(signedAt) }),
  });
};

// ════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════

export const createNotification = async (data: {
  userId: string;
  applicationId?: string;
  title: string;
  message: string;
  type: string;
}) => {
  await db.collection('notifications').add({
    ...data,
    isRead: false,
    createdAt: FieldValue.serverTimestamp(),
  });
};

export const getUserNotifications = async (userId: string) => {
  const snap = await db
    .collection('notifications')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const markNotificationRead = async (id: string) => {
  await db.collection('notifications').doc(id).update({ isRead: true });
};

// ════════════════════════════════════════
// NEWS & KNOWLEDGE
// ════════════════════════════════════════

export const getNews = async (limit = 10, subsidiaryId?: string) => {
  let q: Query = db.collection('news').where('isPublished', '==', true);
  if (subsidiaryId) q = q.where('subsidiaryId', '==', subsidiaryId);
  q = q.orderBy('publishedAt', 'desc').limit(limit);
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getKnowledgeArticles = async (category?: string) => {
  let q: Query = db.collection('knowledge').where('isPublished', '==', true);
  if (category) q = q.where('category', '==', category);
  const snap = await q.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getSubsidiaries = async () => {
  const snap = await db.collection('subsidiaries').orderBy('name').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ════════════════════════════════════════
// ANALYTICS (для admin дашборда)
// ════════════════════════════════════════

export const getAnalytics = async () => {
  const [applicationsSnap, usersSnap, servicesSnap] = await Promise.all([
    db.collection('applications').get(),
    db.collection('users').get(),
    db.collection('services').get(),
  ]);
  
  const applications = applicationsSnap.docs.map(d => d.data());
  
  const statusCounts = applications.reduce((acc: Record<string, number>, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalApplications: applications.length,
    totalUsers: usersSnap.size,
    totalServices: servicesSnap.size,
    statusCounts,
    approvalRate: statusCounts['APPROVED']
      ? Math.round((statusCounts['APPROVED'] / applications.length) * 100)
      : 0,
  };
};
