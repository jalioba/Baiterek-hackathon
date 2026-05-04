import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';
import { api } from '../api';

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerUser = async (data: any) => {
  // 1. Создаём пользователя в Firebase Auth
  const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
  // 2. Создаём профиль в Firestore через Express
  await api.register({ ...data, uid: user.uid });
  return user;
};

export const logoutUser = () => signOut(auth);
export const onAuthChange = (cb: any) => onAuthStateChanged(auth, cb);
