// listModels.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

async function listAvailableModels() {
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // TypeScript workaround for missing method type
    const modelsResponse = await (genAI as any).listModels();
    const models = modelsResponse.models;

    console.log("✅ Available Gemini Models:");
    for (const model of models) {
      console.log(`- ${model.name} (Methods: ${model.supportedGenerationMethods?.join(", ")})`);
    }
  } catch (error: any) {
    console.error("❌ Error listing models:", error.message);
    console.error("Full error:", error);
  }
}

listAvailableModels();
