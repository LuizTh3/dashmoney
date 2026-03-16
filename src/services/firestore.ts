import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Transaction, Category, User } from '../types';

// ============ USERS ============

export const getUserData = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { uid: userDoc.id, ...userDoc.data() } as User;
  }
  return null;
};

export const createUserDocument = async (uid: string, email: string, displayName: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid,
      email,
      displayName,
      currency: 'BRL',
      darkMode: false,
      createdAt: serverTimestamp(),
    });
  }
};

import { setDoc } from 'firebase/firestore';

export const updateUserPreferences = async (uid: string, data: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, 'users', uid), data);
};

// ============ TRANSACTIONS ============

const transactionsCollection = collection(db, 'transactions');

export const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const q = query(
    transactionsCollection,
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[];
};

export const addTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = serverTimestamp();
  const docRef = await addDoc(transactionsCollection, {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<void> => {
  await updateDoc(doc(db, 'transactions', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'transactions', id));
};

// ============ CATEGORIES ============

const categoriesCollection = collection(db, 'categories');

export const getCategories = async (userId: string): Promise<Category[]> => {
  const q = query(
    categoriesCollection,
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
};

export const addCategory = async (data: Omit<Category, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(categoriesCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
  await updateDoc(doc(db, 'categories', id), data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'categories', id));
};

// ============ HELPERS ============

export const toDate = (timestamp: Timestamp | Date | string): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  return new Date();
};

export const toTimestamp = (date: Date | string): Timestamp | string => {
  if (typeof date === 'string') {
    return date;
  }
  return Timestamp.fromDate(date);
};
