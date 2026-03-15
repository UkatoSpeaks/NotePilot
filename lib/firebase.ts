import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  enableMultiTabIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDT8VX8n507o-Q41H9i47gGh74JKY2oEgI",
  authDomain: "notepilot-ai-801.firebaseapp.com",
  projectId: "notepilot-ai-801",
  storageBucket: "notepilot-ai-801.firebasestorage.app",
  messagingSenderId: "315011397102",
  appId: "1:315011397102:web:492e4f3bc50035b7f20aff"
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
