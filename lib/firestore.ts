import { 
  doc, 
  getDoc, 
  getDocFromCache,
  getDocFromServer,
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "./firebase";

// --- Users & Usage ---

export async function syncUserToFirestore(user: any) {
  const userRef = doc(db, "users", user.uid);
  
  try {
    // getDoc with persistence enabled will automatically try server then cache
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return; 
    }

    // Create new user profile if it doesn't exist
    await setDoc(userRef, {
      name: user.displayName || "NotePilot User",
      email: user.email,
      plan: "free",
      createdAt: serverTimestamp(),
      photoURL: user.photoURL || "",
      studyStreak: 0
    }, { merge: true });

    const today = new Date().toISOString().split('T')[0];
    await setDoc(doc(db, "usage", user.uid), {
      notesToday: 0,
      flashcardsToday: 0,
      questionsToday: 0,
      lastReset: today,
      studyStreak: 0
    }, { merge: true });
  } catch (error) {
    console.error("syncUserToFirestore: Error during sync.", error);
  }
}

export async function getUserUsage(userId: string) {
  const usageRef = doc(db, "usage", userId);
  
  try {
    const usageSnap = await getDoc(usageRef);
    const today = new Date().toISOString().split('T')[0];

    if (usageSnap.exists()) {
      const data = usageSnap.data();
      if (data.lastReset !== today) {
        try {
          await updateDoc(usageRef, {
            notesToday: 0,
           flashcardsToday: 0,
            questionsToday: 0,
            lastReset: today
          });
          return { ...data, notesToday: 0, flashcardsToday: 0, questionsToday: 0, lastReset: today };
        } catch (e) {
          console.warn("getUserUsage: Could not update reset date (offline?)", e);
        }
      }
      return data;
    }
  } catch (error) {
    console.error("getUserUsage: Error fetching usage.", error);
  }
  return null;
}

// --- Notes ---

export interface NoteStructure {
  definition: string;
  keyConcepts: string[];
  formulas?: string[];
  examples: string[];
  examQuestions: { question: string, answer: string }[] | string[];
}

export async function saveNote(userId: string, subject: string, topic: string, content: NoteStructure | string) {
  const noteData = {
    userId,
    subject,
    topic,
    content,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "notes"), noteData);
  
  // Track usage
  await updateDoc(doc(db, "usage", userId), {
    notesToday: increment(1)
  });

  return docRef.id;
}

export async function getRecentNotes(userId: string, limitCount = 5) {
  const notesRef = collection(db, "notes");
  const q = query(
    notesRef, 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.warn("getRecentNotes: Fetch failed, trying cache...", error);
    return [];
  }
}

export async function getNote(noteId: string) {
  const noteRef = doc(db, "notes", noteId);
  try {
    const noteSnap = await getDoc(noteRef);
    if (noteSnap.exists()) {
      return { id: noteSnap.id, ...noteSnap.data() } as any;
    }
  } catch (error) {
    console.error("getNote: Error fetching note", error);
  }
  return null;
}

export async function getAllNotes(userId: string) {
  const notesRef = collection(db, "notes");
  const q = query(
    notesRef, 
    where("userId", "==", userId), 
    orderBy("createdAt", "desc")
  );
  
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
  } catch (error) {
    console.error("getAllNotes: Error fetching all notes", error);
    return [];
  }
}

// --- Flashcards ---

export async function saveFlashcards(userId: string, topic: string, cards: { question: string, answer: string }[]) {
  const flashcardData = {
    userId,
    topic,
    cards,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "flashcards"), flashcardData);
  
  await updateDoc(doc(db, "usage", userId), {
    flashcardsToday: increment(1)
  });

  return docRef.id;
}

// --- Questions ---

export async function saveQuestions(userId: string, topic: string, questions: any[]) {
  const questionData = {
    userId,
    topic,
    questions,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "questions"), questionData);
  
  await updateDoc(doc(db, "usage", userId), {
    questionsToday: increment(1)
  });

  return docRef.id;
}

// --- Files ---

export async function saveFileInfo(userId: string, fileName: string, fileURL: string) {
  const fileData = {
    userId,
    fileName,
    fileURL,
    createdAt: serverTimestamp(),
  };

  return await addDoc(collection(db, "files"), fileData);
}
