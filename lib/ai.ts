import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const model = {
  async generateContent(prompt: string) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert tutor specializing in school curriculum. Always respond in valid JSON format only, without markdown code blocks unless requested.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.5,
        max_tokens: 2048,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
      });

      const content = chatCompletion.choices[0]?.message?.content || "";
      
      // Return an object structure that mimics the previous Gemini implementation 
      // to avoid breaking existing API routes.
      return {
        response: {
          text: () => content
        }
      };
    } catch (error) {
      console.error("Groq AI Error:", error);
      throw new Error("Failed to generate content from Groq AI");
    }
  }
};

export async function generateContent(prompt: string) {
  const result = await model.generateContent(prompt);
  return result.response.text();
}
