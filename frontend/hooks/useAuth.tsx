'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, loginUser, logoutUser } from '@/lib/firebase/auth';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    return onAuthChange(async (firebaseUser: User | null) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        document.cookie = `firebase-token=${token}; path=/; max-age=3600`;
        try {
          const profile = await api.getProfile();
          setProfile(profile);
        } catch (e) {
          console.error("Failed to fetch user profile", e);
          setProfile(null);
        }
      } else {
        document.cookie = "firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser(email, password);
    router.push('/dashboard');
  };

  const logout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAdmin: profile?.role === 'ADMIN',
      isAuthor: ['ADMIN', 'AUTHOR'].includes(profile?.role),
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
