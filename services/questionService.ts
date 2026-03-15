import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function saveQuestions(userId: string, data: {
  topic: string;
  questions: any[];
}) {
  const questionsRef = collection(db, "questions");
  const docRef = await addDoc(questionsRef, {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  });

  // Increment usage
  const usageRef = doc(db, "usage", userId);
  await updateDoc(usageRef, {
    questionsToday: increment(1)
  });

  return docRef.id;
}
