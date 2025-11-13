// chat.js
import { sendMessageToBackend } from './api.js';

// DOM elements
const messagesContainer = document.querySelector("#messages");
const chatWindow = document.querySelector("#chat-window");
const userInput = document.querySelector("#user-input");
const sendButton = document.querySelector("#send-btn");

// Friendly pre-text messages
const friendlyMessages = [
  "That was an easy one!",
  "Hmm, let's see...",
  "Great question!",
  "Let me think about that...",
  "Interesting! Here's what I found:",
  "Good one! Let me help you with that:",
  "Aha! I know this one:",
  "Let me look that up for you..."
];

// Loading messages for longer responses
const loadingMessages = [
  "Wait, I'm working on it...",
  "Give me a moment...",
  "Processing your request...",
  "Hang tight, almost there...",
  "Thinking hard about this one..."
];

// Helper: Get random message from array
function getRandomMessage(messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

// Helper: Create message bubble
function createMessageBubble(text, ...classes) {
  const bubble = document.createElement("div");
  bubble.classList.add("message", ...classes); // spread works for multiple or single classes
  bubble.textContent = text;
  return bubble;
}


// Helper: Scroll to bottom smoothly
function scrollToBottom() {
  chatWindow.scrollTo({
    top: chatWindow.scrollHeight,
    behavior: 'smooth'
  });
}

// Helper: Show typing indicator
function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot-message", "typing-indicator");
  typing.id = "typing-indicator";

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.classList.add("typing-dot");
    typing.appendChild(dot);
  }

  messagesContainer.appendChild(typing);
  scrollToBottom();
  return typing;
}

// Helper: Remove typing indicator
function removeTypingIndicator() {
  const typing = document.getElementById("typing-indicator");
  if (typing) {
    typing.remove();
  }
}

// Helper: Show loading message after delay
let loadingTimeout;
function showLoadingMessage() {
  loadingTimeout = setTimeout(() => {
    removeTypingIndicator();
    const loadingMsg = createMessageBubble(
      getRandomMessage(loadingMessages),
      "bot-message", "loading-message"
    );
    const spinner = document.createElement("span");
    spinner.classList.add("spinner");
    loadingMsg.appendChild(spinner);
    loadingMsg.id = "loading-message";
    messagesContainer.appendChild(loadingMsg);
    scrollToBottom();
  }, 4000); // Show after 4 seconds
}

// Helper: Clear loading message
function clearLoadingMessage() {
  clearTimeout(loadingTimeout);
  const loadingMsg = document.getElementById("loading-message");
  if (loadingMsg) {
    loadingMsg.remove();
  }
}

// Display bot message with optional friendly pre-text
function displayBotMessage(text, showFriendlyMessage = true) {
  // Show friendly pre-text message
  if (showFriendlyMessage) {
    const friendlyMsg = createMessageBubble(
      getRandomMessage(friendlyMessages),
      "bot-message","friendly-message"
    );
    messagesContainer.appendChild(friendlyMsg);
  }

  // Show main response
  setTimeout(() => {
    const botBubble = createMessageBubble(text, "bot-message");
    messagesContainer.appendChild(botBubble);
    scrollToBottom();
  }, showFriendlyMessage ? 300 : 0);
}

// Send button animation
function animateSendButton() {
  sendButton.classList.add("sending");
  setTimeout(() => {
    sendButton.classList.remove("sending");
  }, 600);
}

// Send message handler
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Animate send button
  animateSendButton();

  // 1. Show user message
  const userBubble = createMessageBubble(message, "user-message");
  messagesContainer.appendChild(userBubble);
  scrollToBottom();
  
  // Clear input
  userInput.value = "";

  // 2. Show typing indicator
  showTypingIndicator();

  // 3. Set up loading message timeout (4-5 seconds)
  showLoadingMessage();

  // 4. Get bot response
  const result = await sendMessageToBackend(message);

  // 5. Clear indicators and loading
  removeTypingIndicator();
  clearLoadingMessage();

  // 6. Show bot message with friendly pre-text
  if (result.success) {
    displayBotMessage(result.response, true);
  } else {
    displayBotMessage(result.response, false);
  }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Focus input on load
userInput.focus();

// Show initial bot message on load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const welcomeMessage = "Hi, I am Campus Buddy! I am here to assist you. How can I help you today?";
    displayBotMessage(welcomeMessage, false);
  }, 500);
});