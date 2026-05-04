'use client';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getUserApplications, getApplicationById } from '@/lib/firebase/firestore';

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = getUserApplications(user.uid, (apps) => {
      setApplications(apps);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);
  
  return { applications, loading };
};

export const useApplication = (id: string) => {
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    const unsubscribe = getApplicationById(id, (app) => {
      setApplication(app);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [id]);
  
  return { application, loading };
};
