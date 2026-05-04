'use client';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getUserNotifications, markNotificationAsRead } from '@/lib/firebase/firestore';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = getUserNotifications(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await markNotificationAsRead(n.id);
    }
  };
  
  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
};
