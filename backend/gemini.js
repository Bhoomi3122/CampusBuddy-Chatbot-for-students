import 'dotenv/config';

let ai = null;

// Lazy-initialize the GenAI client
async function initializeGenAI() {
  if (ai) return ai;

  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not set in environment variables.");
      return null;
    }

    ai = new GoogleGenerativeAI(apiKey);
    console.log("✓ Gemini AI initialized successfully");

    // Remove the recursive call and listModels (since it may not exist)
    // If you want to log available models, you can hardcode or fetch via REST

    return ai;
  } catch (error) {
    console.error("❌ Failed to initialize GenAI:", error.message);
    return null;
  }
}

export async function generateChatResponse(message) {
  try {
    const client = await initializeGenAI();

    if (!client) {
      return "AI service is currently unavailable. Please check your API key configuration.";
    }

    // Get the generative model
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); // updated to a working model

    const prompt = `You are Campus Buddy, a helpful and friendly student assistant for MITS Gwalior.
Answer clearly, conversationally, and concisely.

Student Question: ${message}

Please provide a helpful response:`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("❌ Gemini API error:", error);

    if (error.message?.includes("API key")) {
      return "Authentication error. Please check your API key configuration.";
    } else if (error.message?.includes("quota")) {
      return "API quota exceeded. Please try again later.";
    } else if (error.message?.includes("PERMISSION_DENIED")) {
      return "API access denied. Please verify your Gemini API key is valid and has the correct permissions.";
    }

    return "Failed to generate response. Please try again later.";
  }
}
