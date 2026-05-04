import { Request, Response, NextFunction } from 'express';
import { adminAuth, db } from '../config/firebase';

// Расширяем Request чтобы хранить данные пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  
  const idToken = authHeader.split('Bearer ')[1];
  
  try {
    // Firebase Admin верифицирует ID Token выданный Firebase Auth на фронте
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Получаем профиль из Firestore чтобы узнать роль
    try {
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      const userData = userDoc.data();
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: userData?.role || 'USER',
      };
    } catch (e) {
      // Если Firestore недоступен (нет прав или другая ошибка), назначаем базовую роль
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: 'USER',
      };
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

export const requireAuthor = (req: Request, res: Response, next: NextFunction) => {
  if (!['ADMIN', 'AUTHOR'].includes(req.user?.role || '')) {
    return res.status(403).json({ error: 'Forbidden: Author access required' });
  }
  next();
};

// Keep old requireRole for backwards compatibility with routes that use it
export function requireRole(...roles: Array<string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Недостаточно прав" });
    }
    next();
  };
}
