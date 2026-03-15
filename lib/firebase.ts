import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  enableMultiTabIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firestore with settings to bypass restrictive networks
let db: any;
if (getApps().length === 0) {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
} else {
  try {
    db = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    });
  } catch (e) {
    db = getFirestore(app);
  }
}

// Enable offline persistence (Client-side only)
if (typeof window !== "undefined") {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("Firestore persistence failed: Multiple tabs open.");
    } else if (err.code === "unimplemented") {
      console.warn("Firestore persistence unsupported in this browser.");
    }
  });
}

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
