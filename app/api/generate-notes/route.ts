import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/ai";
import { saveNote } from "@/services/notesService";
import { getUserUsage } from "@/lib/firestore";

const FREE_LIMIT = 5;

export async function POST(req: NextRequest) {
  try {
    const { userId, subject, topic, class: className, board } = await req.json();

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Check Usage Limits
    const usage = await getUserUsage(userId);
    if (usage && usage.notesToday >= FREE_LIMIT) {
      return NextResponse.json({ error: "Daily limit reached. Upgrade to Pro!" }, { status: 429 });
    }

    // 2. Prepare Prompt
    const prompt = `
      You are an expert tutor. Generate detailed, structured study notes for a Class ${className} ${board} student.
      Subject: ${subject}
      Topic: ${topic}

      Return the response in this EXACT JSON format:
      {
        "definition": "Clear and simple definition",
        "keyConcepts": ["Concept 1", "Concept 2", ...],
        "formulas": ["Optional Formula 1", ...],
        "examples": ["Real-world example 1", ...],
        "examQuestions": ["Sample exam question 1", ...]
      }
    `;

    // 3. Generate AI Content
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const content = JSON.parse(text);

    // 4. Save to Firestore
    const noteId = await saveNote(userId, {
      subject,
      topic,
      class: className,
      board,
      content
    });

    return NextResponse.json({ success: true, noteId, content });
  } catch (error) {
    console.error("Generate Notes API Error:", error);
    return NextResponse.json({ error: "Failed to generate notes" }, { status: 500 });
  }
}
