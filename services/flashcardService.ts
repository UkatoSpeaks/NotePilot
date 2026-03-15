import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Flashcard {
  question: string;
  answer: string;
}

export async function saveFlashcards(userId: string, data: {
  topic: string;
  cards: Flashcard[];
}) {
  const flashcardsRef = collection(db, "flashcards");
  const docRef = await addDoc(flashcardsRef, {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });

  // Increment usage
  const usageRef = doc(db, "usage", userId);
  await updateDoc(usageRef, {
    flashcardsToday: increment(1)
  });

  return docRef.id;
}
