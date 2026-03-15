import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/ai";
import { saveQuestions } from "@/services/questionService";
import { getUserUsage } from "@/lib/firestore";

const QUESTION_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const { userId, topic, subject, difficulty } = await req.json();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const usage = await getUserUsage(userId);
    if (usage && usage.questionsToday >= QUESTION_LIMIT) {
      return NextResponse.json({ error: "Question limit reached." }, { status: 429 });
    }

    const prompt = `
      Generate a balanced exam paper for the subject: ${subject}, topic: ${topic}. 
      Difficulty level: ${difficulty}.
      Include:
      - 2 Multiple Choice Questions (MCQ)
      - 2 Short Answer Questions
      - 1 Long Answer Question
      
      Return the response in this EXACT JSON format:
      {
        "questions": [
          { "type": "MCQ", "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" },
          { "type": "Short", "question": "...", "answer": "..." },
          { "type": "Long", "question": "...", "answer": "..." }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const content = JSON.parse(text);
    const questions = content.questions;

    const questionSetId = await saveQuestions(userId, {
      topic,
      questions
    });

    return NextResponse.json({ success: true, questionSetId, questions });
  } catch (error) {
    console.error("Generate Questions API Error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
