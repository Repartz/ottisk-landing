// Просмотреть все документы в коллекции portfolio
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'portfolio'));
console.log('Документов в portfolio:', snap.size);
console.log('---');
snap.docs.forEach((d, i) => {
  console.log(`#${i + 1} id=${d.id}`);
  console.log(JSON.stringify(d.data(), null, 2));
  console.log('---');
});
process.exit(0);
