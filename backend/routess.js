import { generateChatResponse } from "./gemini.js";
import { getMITSResponse } from "./mits.js";

export function registerRoutes(app) {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          error: "Message is required",
          response: "Please provide a message."
        });
      }

      // Check if query matches MITS knowledge
      const mitsResponse = getMITSResponse(message);
      let response;

      if (mitsResponse) {
        // MITS response found
        response = mitsResponse;
      } else {
        // Use Gemini for general queries
        response = await generateChatResponse(message);
      }
      console.log("Sending response:", response);
      res.json({ response });
    } catch (err) {
      console.error("Chat API error:", err);
      res.status(500).json({ 
        error: "Failed to process request",
        response: "I'm having trouble processing that right now. Please try again later."
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Campus Buddy API is running" });
  });
}