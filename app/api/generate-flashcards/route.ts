import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/ai";
import { saveFlashcards } from "@/services/flashcardService";
import { getUserUsage } from "@/lib/firestore";

const FLASHCARD_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const { userId, topic } = await req.json();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const usage = await getUserUsage(userId);
    if (usage && usage.flashcardsToday >= FLASHCARD_LIMIT) {
      return NextResponse.json({ error: "Flashcard limit reached." }, { status: 429 });
    }

    const prompt = `
      Create 5 high-quality flashcards for the topic: ${topic}.
      Target audience: School students.
      
      Return the response in this EXACT JSON format:
      {
        "cards": [
          { "question": "Short Question?", "answer": "Concise Answer" },
          ...
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const content = JSON.parse(text);
    const cards = content.cards;

    const flashcardId = await saveFlashcards(userId, {
      topic,
      cards
    });

    return NextResponse.json({ success: true, flashcardId, cards });
  } catch (error) {
    console.error("Generate Flashcards API Error:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
