import { Router } from 'express';
import { adminAuth, db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Регистрация — фронт создаёт пользователя через Firebase Auth клиент,
// этот эндпоинт создаёт профиль в Firestore
router.post('/register', async (req, res) => {
  const { uid, email, firstName, lastName, phone, iin, bin, companyName, companyType } = req.body;
  
  try {
    // Верифицируем что uid существует в Firebase Auth
    await adminAuth.getUser(uid);
    
    // Создаём профиль в Firestore
    await db.collection('users').doc(uid).set({
      email,
      role: 'USER',
      firstName,
      lastName,
      phone: phone || '',
      iin: iin || '',
      bin: bin || '',
      companyName: companyName || '',
      companyType: companyType || 'IP',
      createdAt: FieldValue.serverTimestamp(),
    });
    
    res.json({ success: true, uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Получение профиля текущего пользователя
router.get('/me', authenticate, async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.user!.uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'User profile not found in Firestore' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Назначение роли (только ADMIN)
router.patch('/users/:uid/role', authenticate, async (req, res) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  const { role } = req.body;
  try {
    await db.collection('users').doc(req.params.uid).update({ role });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// The client handles login directly with Firebase now, so we don't strictly need a /login route.
// But we can add a dummy logout route to clear old cookies if needed.
router.post("/logout", (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: "Выход выполнен" });
});

export default router;
