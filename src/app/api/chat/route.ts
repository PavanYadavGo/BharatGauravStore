// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// 1. Explicitly check for the API key and fail early if not found.
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
  // In a production environment, you might want to throw an error here
  // to prevent the application from starting if the key is missing.
  // throw new Error("GEMINI_API_KEY is not configured.");
}

const genAI = new GoogleGenerativeAI(apiKey!); // '!' asserts that apiKey is not null/undefined

// Optional: Configure safety settings if needed
// These are examples; adjust them based on your application's requirements.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(req: NextRequest) {
  // 2. Ensure API key is available at runtime (important for serverless environments)
  if (!apiKey) {
    console.error("Gemini API Key not found at runtime.");
    return NextResponse.json(
      { error: "API configuration error. Unable to process request." },
      { status: 500 }
    );
  }

  let message: string; // Explicitly type message as string
  try {
    const requestBody = await req.json();
    message = requestBody.message;
  } catch (error) {
    console.error("Error parsing request JSON:", error);
    return NextResponse.json({ error: "Invalid request body. Expecting JSON with a 'message' property." }, { status: 400 }); // Bad Request
  }

  // 3. Validate that the message exists
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json(
      { error: "Message is required and must be a non-empty string." },
      { status: 400 } // Bad Request
    );
  }

  try {
    // *** IMPORTANT CHANGE HERE ***
    // Use the correct model name for general text generation, which is often 'gemini-pro'.
    // 'gemini-1.0-pro' might refer to a specific, older version or a different use case.
    // Always refer to the latest Google Gemini API documentation for available models.
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash", // Changed from "gemini-1.0-pro" to "gemini-pro"
      // safetySettings, // Uncomment if you want to apply custom safety settings
      // generationConfig: { // Optional: configure generation parameters
      //   maxOutputTokens: 2048,
      //   temperature: 0.7,
      //   topP: 1,
      //   topK: 1,
      // }
    });

    console.log("Sending to Gemini:", message); // Log the message being sent

    const result = await model.generateContent(message);
    const geminiResponse = result.response;

    // 4. Thoroughly check the response from Gemini
    if (!geminiResponse) {
      console.error("Gemini API Error: No response object returned from generateContent.", result);
      return NextResponse.json(
        { error: "Failed to get a response from the AI service." },
        { status: 500 }
      );
    }

    // 5. Check for content blocking or other issues indicated by promptFeedback
    //    (Important for identifying why content might not be generated)
    if (geminiResponse.promptFeedback?.blockReason) {
      console.warn(
        `Gemini Warning: Content generation blocked. Reason: ${geminiResponse.promptFeedback.blockReason}`,
        geminiResponse.promptFeedback
      );
      return NextResponse.json(
        {
          error: `Your request was blocked by the AI for the following reason: ${geminiResponse.promptFeedback.blockReason}. Please revise your prompt.`,
          details: geminiResponse.promptFeedback,
        },
        { status: 400 } // Bad Request, as the user's input caused the block
      );
    }

    // 6. Ensure candidates exist before trying to access text
    if (!geminiResponse.candidates || geminiResponse.candidates.length === 0) {
      console.warn("Gemini Warning: No candidates returned in the response.", geminiResponse);
      // This might happen if content is filtered due to safety settings at the candidate level,
      // even if promptFeedback doesn't indicate a block.
      const finishReason = geminiResponse.candidates?.[0]?.finishReason;
      const safetyRatings = geminiResponse.candidates?.[0]?.safetyRatings;
      if (finishReason && finishReason !== "STOP") {
        return NextResponse.json(
          {
            error: `AI could not complete the request. Finish reason: ${finishReason}`,
            details: { safetyRatings }
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: "The AI did not provide a valid response candidate." },
        { status: 500 }
      );
    }

    // 7. Get the text from the response
    const text = geminiResponse.text(); // This is a helper that usually gets the first candidate's text.

    if (typeof text !== 'string' || text.trim() === '') {
      console.warn("Gemini Warning: Empty text response from AI.", geminiResponse);
      return NextResponse.json(
        { error: "AI returned an empty response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: text });

  } catch (error: any) { // Catch 'any' to inspect different error types
    console.error("-----------------------------------------");
    console.error("Unhandled Error in Gemini API call:");
    console.error("Error Name:", error?.name);
    console.error("Error Message:", error?.message);
    console.error("Error Stack:", error?.stack);
    // If the error object has more details (e.g., from the SDK), log them
    if (error.cause) {
      console.error("Error Cause:", error.cause);
    }
    if (error.response?.data) { // For Axios-like errors potentially wrapped by the SDK
      console.error("Error Response Data:", error.response.data);
    }
    console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error("-----------------------------------------");

    // Provide a generic error message to the client
    // You might want to customize this based on the error type if possible
    return NextResponse.json(
      { error: "Sorry, an unexpected error occurred while trying to respond." },
      { status: 500 }
    );
  }
}