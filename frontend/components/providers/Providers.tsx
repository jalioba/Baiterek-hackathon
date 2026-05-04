'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { LangProvider } from '@/lib/i18n';
import { startMetricsSimulation } from '@/lib/firebase/rtdb';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    startMetricsSimulation();
  }, []);

  return (
    <LangProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LangProvider>
  );
}
