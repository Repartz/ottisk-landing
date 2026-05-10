// ============================================
// FIREBASE: Инициализация и конфигурация
// Lazy-инициализация: Firebase подключается только если переменные окружения заданы.
// На этапе разработки без ключей — возвращает null, fallback на локальные данные.
// ============================================

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Проверка, что все ключи Firebase заданы
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
};

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

// Lazy-инициализация Firebase
const getFirebaseApp = (): FirebaseApp | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (app) return app;
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return app;
};

// Firestore — основная база данных
export const getDb = (): Firestore | null => {
  if (dbInstance) return dbInstance;
  const application = getFirebaseApp();
  if (!application) return null;
  dbInstance = getFirestore(application);
  return dbInstance;
};

// Совместимость с прежним API (db напрямую) — теперь возвращает null если Firebase не настроен
export const db = (): Firestore | null => getDb();

// Firebase Storage — для загрузки фото портфолио
// Передаём bucket явно — новый формат *.firebasestorage.app требует gs:// URL
export const getStorageInstance = (): FirebaseStorage | null => {
  if (storageInstance) return storageInstance;
  const application = getFirebaseApp();
  if (!application) return null;
  const bucket = firebaseConfig.storageBucket;
  // Если bucket задан — передаём как gs://bucket, иначе дефолт
  if (bucket) {
    const gsUrl = bucket.startsWith('gs://') ? bucket : `gs://${bucket}`;
    storageInstance = getStorage(application, gsUrl);
  } else {
    storageInstance = getStorage(application);
  }
  return storageInstance;
};

// Analytics — только на клиенте, если Firebase настроен
export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;
  const application = getFirebaseApp();
  if (!application) return null;
  const supported = await isSupported();
  return supported ? getAnalytics(application) : null;
};

export default getFirebaseApp;
