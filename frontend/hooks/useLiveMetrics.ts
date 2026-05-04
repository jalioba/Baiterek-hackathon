'use client';
import { useEffect, useState } from 'react';
import { subscribeToMetrics } from '@/lib/firebase/rtdb';

export const useLiveMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  
  useEffect(() => {
    const unsubscribe = subscribeToMetrics((data) => setMetrics(data));
    return () => unsubscribe();
  }, []);
  
  return metrics;
};
