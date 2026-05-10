// Тестовый скрипт: пробует записать документ в Firestore и прочитать обратно.
// Запуск: node scripts/test-firestore.mjs
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('▶ Конфиг загружен:');
console.log('  projectId:', firebaseConfig.projectId);
console.log('  apiKey:', firebaseConfig.apiKey?.slice(0, 12) + '…');
console.log('');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
  console.log('▶ Пытаюсь записать тестовый документ…');
  const docRef = await addDoc(collection(db, 'portfolio'), {
    title: { ru: '[TEST] node script', en: '[TEST] node script' },
    description: { ru: 'тест из node', en: 'test from node' },
    image: '',
    tags: ['test'],
    createdAt: new Date().toISOString(),
  });
  console.log('  ✓ Документ создан, ID:', docRef.id);

  console.log('▶ Читаю всю коллекцию portfolio…');
  const snap = await getDocs(collection(db, 'portfolio'));
  console.log('  ✓ Документов в коллекции:', snap.size);

  console.log('▶ Удаляю тестовый документ…');
  await deleteDoc(docRef);
  console.log('  ✓ Удалён');

  console.log('');
  console.log('🎉 Firebase РАБОТАЕТ. Проблема, вероятно, в UI (браузере).');
} catch (err) {
  console.log('');
  console.log('❌ ОШИБКА:');
  console.log('  code:', err.code);
  console.log('  message:', err.message);
  console.log('');
  if (err.code === 'permission-denied') {
    console.log('🔒 Это ПРАВИЛА FIRESTORE блокируют запись.');
    console.log('   Перейдите в Firebase Console → Firestore → Rules');
    console.log('   и убедитесь, что правила в режиме test mode.');
  }
}
process.exit(0);
