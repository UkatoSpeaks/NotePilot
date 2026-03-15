import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface NoteContent {
  definition: string;
  keyConcepts: string[];
  formulas?: string[];
  examples: string[];
  examQuestions: string[];
}

export async function saveNote(userId: string, data: {
  subject: string;
  topic: string;
  class: string;
  board: string;
  content: NoteContent;
}) {
  const noteRef = collection(db, "notes");
  const docRef = await addDoc(noteRef, {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });

  // Increment usage
  const usageRef = doc(db, "usage", userId);
  await updateDoc(usageRef, {
    notesToday: increment(1)
  });

  return docRef.id;
}

export async function getUserNotes(userId: string) {
  const notesRef = collection(db, "notes");
  const q = query(
    notesRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
