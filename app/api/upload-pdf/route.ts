import { NextRequest, NextResponse } from "next/server";
const pdf = require("pdf-parse");
import { model } from "@/lib/ai";
import { saveNote } from "@/services/notesService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const subject = formData.get("subject") as string || "Extracted from PDF";
    const className = formData.get("class") as string || "10";
    const board = formData.get("board") as string || "CBSE";

    if (!file || !userId) {
      return NextResponse.json({ error: "Missing file or user ID" }, { status: 400 });
    }

    // 1. ArrayBuffer to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Extract Text from PDF
    const pdfData = await pdf(buffer);
    const extractedText = pdfData.text;

    // 3. Send Chunk of text to AI for summarization/notes
    // (For large PDFs, we should ideally chunk this, but for now we'll send a slice)
    const textSample = extractedText.slice(0, 10000); 

    const prompt = `
      You are an expert tutor. I am providing you with text extracted from a school PDF.
      Extract the core concepts and generate structured study notes.
      
      Text: "${textSample}"

      Return the response in this EXACT JSON format:
      {
        "definition": "Clear summary definition",
        "keyConcepts": ["Important Point 1", ...],
        "formulas": ["Relevant Formula", ...],
        "examples": ["Illustration from text", ...],
        "examQuestions": ["Likely question based on this PDF", ...]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const content = JSON.parse(text);

    // 4. Save as a Note
    const noteId = await saveNote(userId, {
      subject,
      topic: file.name.replace(".pdf", ""),
      class: className,
      board,
      content
    });

    return NextResponse.json({ success: true, noteId, content });

  } catch (error) {
    console.error("PDF Upload API Error:", error);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
