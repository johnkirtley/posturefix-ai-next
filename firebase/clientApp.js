import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { devFirebaseConfig, prodFirebaseConfig } from './enviornments';

let firebaseConfig;

if (process.env.NEXT_PUBLIC_ENV === 'dev') {
    firebaseConfig = devFirebaseConfig;
}

if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    firebaseConfig = prodFirebaseConfig;
}

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

export { firebaseApp, firestore, firebaseAuth };
