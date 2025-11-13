// api.js

// Sends a message to the backend and gets a response
export async function sendMessageToBackend(message) {
  try {
    // Backend route defined in backend/routes.js is POST /api/chat
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (${response.status})`);
    }

    const data = await response.json();
    console.log("Received from backend:", data);

    // backend returns { response: "..." }
    return {
      success: true,
      response: data.response || "Sorry, no response received.",
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      response: "Oops! Something went wrong. Please try again.",
    };
  }
}