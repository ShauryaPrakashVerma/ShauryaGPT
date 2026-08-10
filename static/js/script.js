/* =========================================================
   ELEMENTS
========================================================= */

const app = document.querySelector(".app");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const newChatBtn = document.getElementById("newChatBtn");

const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const messagesContainer = document.getElementById("messages");

const suggestions = document.querySelectorAll(".suggestion-card");
const conversations = document.querySelectorAll(".conversation");

const helpBtn = document.getElementById("helpBtn");

/* =========================================================
   SIDEBAR TOGGLE
========================================================= */

menuBtn.addEventListener("click", () => {
  app.classList.toggle("sidebar-collapsed");
});

/* =========================================================
   NEW CONVERSATION
========================================================= */

newChatBtn.addEventListener("click", () => {
  // Remove existing messages
  messagesContainer.innerHTML = "";

  // Clear input
  chatInput.value = "";

  // Reset textarea height
  chatInput.style.height = "auto";

  // Update title
  const chatTitle = document.querySelector(".chat-title");

  if (chatTitle) {
    chatTitle.textContent = "New conversation";
  }

  // Remove active state from all conversations
  conversations.forEach((conversation) => {
    conversation.classList.remove("active");
  });

  // Activate first conversation
  if (conversations.length > 0) {
    conversations[0].classList.add("active");
  }

  // Focus input
  chatInput.focus();
});

/* =========================================================
   CONVERSATION SELECTION
========================================================= */

conversations.forEach((conversation) => {
  conversation.addEventListener("click", () => {
    // Remove active state
    conversations.forEach((item) => {
      item.classList.remove("active");
    });

    // Activate selected conversation
    conversation.classList.add("active");

    // Get conversation title
    const titleElement = conversation.querySelector(".conversation-title");

    const title = titleElement
      ? titleElement.textContent.trim()
      : "Conversation";

    // Update top title
    const chatTitle = document.querySelector(".chat-title");

    if (chatTitle) {
      chatTitle.textContent = title;
    }
  });
});

/* =========================================================
   SUGGESTION CARDS
========================================================= */

suggestions.forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    const question = suggestion.dataset.question;

    if (!question) {
      return;
    }

    // Put question into input
    chatInput.value = question;

    // Resize textarea
    resizeTextarea();

    // Focus input
    chatInput.focus();
  });
});

/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {
  const message = chatInput.value.trim();

  // Don't send empty messages
  if (!message) {
    return;
  }

  /* -----------------------------------------
       USER MESSAGE
    ----------------------------------------- */

  addMessage(message, "user");

  /* -----------------------------------------
       CLEAR INPUT
    ----------------------------------------- */

  chatInput.value = "";

  chatInput.style.height = "auto";

  /* -----------------------------------------
       UPDATE CONVERSATION TITLE
    ----------------------------------------- */

  updateConversation(message);

  /* -----------------------------------------
       DEMO BOT RESPONSE
       
       Replace this later with your Groq API
       / backend request.
    ----------------------------------------- */

  setTimeout(() => {
    addMessage(generateDemoResponse(message), "bot");
  }, 700);
}

/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(text, type) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", type);

  messageElement.textContent = text;

  messagesContainer.appendChild(messageElement);

  // Scroll to latest message
  messagesContainer.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}

/* =========================================================
   UPDATE CONVERSATION
========================================================= */

function updateConversation(message) {
  if (conversations.length === 0) {
    return;
  }

  const activeConversation = document.querySelector(".conversation.active");

  if (!activeConversation) {
    return;
  }

  const titleElement = activeConversation.querySelector(".conversation-title");

  const previewElement = activeConversation.querySelector(
    ".conversation-preview",
  );

  // Use first part of user's question
  const shortMessage =
    message.length > 30 ? message.substring(0, 30) + "..." : message;

  if (titleElement) {
    titleElement.textContent = shortMessage;
  }

  if (previewElement) {
    previewElement.textContent = message;
  }

  // Update top bar
  const chatTitle = document.querySelector(".chat-title");

  if (chatTitle) {
    chatTitle.textContent = shortMessage;
  }
}

/* =========================================================
   DEMO BOT RESPONSE
========================================================= */

function generateDemoResponse(question) {
  const q = question.toLowerCase();

  if (q.includes("technical") || q.includes("skills")) {
    return (
      "My core technical skills include Python, " +
      "AI/ML, backend development, databases, " +
      "and building intelligent software systems."
    );
  }

  if (q.includes("project") || q.includes("challenging")) {
    return (
      "One of my challenging projects involved " +
      "building an intelligent traffic monitoring " +
      "and control system combining computer vision, " +
      "simulation, and reinforcement learning."
    );
  }

  if (q.includes("system design")) {
    return (
      "I approach system design by first defining " +
      "the requirements and constraints, then " +
      "breaking the system into modular components " +
      "and identifying how data flows between them."
    );
  }

  if (q.includes("ai") || q.includes("ml") || q.includes("machine learning")) {
    return (
      "I have worked with machine learning and AI " +
      "concepts including computer vision, YOLO, " +
      "reinforcement learning, and LLM-based applications."
    );
  }

  if (q.includes("role") || q.includes("job")) {
    return (
      "I'm interested in software engineering and " +
      "AI/ML-oriented roles where I can work on " +
      "real-world intelligent systems."
    );
  }

  if (q.includes("deadline") || q.includes("pressure")) {
    return (
      "I handle deadlines by breaking the work into " +
      "smaller milestones, prioritizing the critical " +
      "components, and iterating toward a working solution."
    );
  }

  return (
    "That's a good question. In the complete version " +
    "of this portfolio bot, this response would be " +
    "generated by the LLM using the portfolio data."
  );
}

/* =========================================================
   SEND BUTTON
========================================================= */

sendBtn.addEventListener("click", () => {
  sendMessage();
});

/* =========================================================
   ENTER TO SEND
========================================================= */

chatInput.addEventListener("keydown", (event) => {
  /*
       Enter       → Send
       Shift+Enter → New line
    */

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    sendMessage();
  }
});

/* =========================================================
   AUTO RESIZE TEXTAREA
========================================================= */

function resizeTextarea() {
  chatInput.style.height = "auto";

  chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + "px";
}

chatInput.addEventListener("input", resizeTextarea);

/* =========================================================
   HELP BUTTON
========================================================= */

helpBtn.addEventListener("click", () => {
  alert(
    "Ask the portfolio bot about experience, " +
      "technical skills, projects, education, " +
      "or career interests.",
  );
});

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  chatInput.focus();
});
