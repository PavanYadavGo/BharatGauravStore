// /lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runGeminiPrompt = async (message: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(message);
  const response = result.response;
  return response.text();
};
