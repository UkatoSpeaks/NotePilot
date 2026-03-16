import { NextRequest, NextResponse } from "next/server";
const pdf = require("pdf-parse-fork");

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
    console.log(`Extracting PDF: ${file.name}`);
    const pdfData = await pdf(buffer);
    const extractedText = pdfData.text;
    console.log(`Success: Extracted ${extractedText.length} chars.`);

    // 3. Send Chunk of text to AI
    const textSample = extractedText.slice(0, 15000); 
    console.log(`Sending ${textSample.length} characters to Groq AI...`);

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
        "examQuestions": [
          { "question": "Likely question based on this PDF", "answer": "Detailed model answer" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("AI generation complete.");
    const content = JSON.parse(text);

    // 4. Save as a Note
    const noteId = await saveNote(userId, {
      subject,
      topic: file.name.replace(".pdf", ""),
      class: className,
      board: board,
      content
    });

    console.log(`Note saved successfully with ID: ${noteId}`);
    return NextResponse.json({ success: true, noteId, content });

  } catch (error) {
    console.error("PDF Upload API Error:", error);
    return NextResponse.json({ 
      error: "Failed to process PDF", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
