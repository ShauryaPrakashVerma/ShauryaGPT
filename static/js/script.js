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

const conversationList = document.getElementById("conversationList");

/* =========================================================
   SIDEBAR TOGGLE
========================================================= */

menuBtn.addEventListener("click", () => {
  app.classList.toggle("sidebar-collapsed");
});

/* =========================================================
   NEW CONVERSATION
========================================================= */

let conversationCount = 0;

newChatBtn.addEventListener("click", () => {

    // Create a unique conversation
    conversationCount++;

    const conversation = document.createElement("button");

    conversation.classList.add(
        "conversation",
        "active"
  );
  
    conversation.innerHTML = `
        <div class="conversation-content">
            <span class="conversation-title">
                New conversation
            </span>

            <span class="conversation-preview">
                Start a new conversation...
            </span>
        </div>

        <span class="conversation-time">
            NOW
        </span>
    `;

    // Remove active state from old conversations
    document
        .querySelectorAll(".conversation")
        .forEach(item => {
            item.classList.remove("active");
        });

    // Add new conversation to sidebar
    conversationList.prepend(conversation);

    // Clear current messages
    messagesContainer.innerHTML = "";

    // Reset input
    chatInput.value = "";
    chatInput.style.height = "auto";

    // Reset top title
    document.querySelector(".chat-title").textContent =
        "New conversation";

    // Focus input
    chatInput.focus();
});

/* =========================================================
   CONVERSATION SELECTION
========================================================= */

conversationList.addEventListener("click", (event) => {

    const conversation =
        event.target.closest(".conversation");

    // Click wasn't on a conversation
    if (!conversation) {
        return;
    }

    // Remove active state from every conversation
    document.querySelectorAll(".conversation").forEach((item) => {
        item.classList.remove("active");
    });

    // Make clicked conversation active
    conversation.classList.add("active");

    // Get conversation title
    const titleElement =
        conversation.querySelector(".conversation-title");

    const title = titleElement
        ? titleElement.textContent.trim()
        : "New conversation";

    // Change top bar title
    document.querySelector(".chat-title").textContent = title;

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

async function sendMessage() {

    const message = chatInput.value.trim();

    if (!message) {
        return;
    }

    // Display user's message
    addMessage(message, "user");

    // Clear input
    chatInput.value = "";
    chatInput.style.height = "auto";

    try {

        const response = await fetch("/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Display Flask/LLM response
        addMessage(data.response, "bot");

    } catch (error) {
        console.error("Error:", error);
        addMessage(
            "Sorry, something went wrong.",
            "bot"
        );
    }
}

/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(text, type) {

    const messageElement = document.createElement("div");

    messageElement.classList.add(
        "message",
        type
    );

    if (type === "bot") {
        messageElement.innerHTML = marked.parse(text);
    } else {
        messageElement.textContent = text;
    }

    messagesContainer.appendChild(messageElement);

    scrollToLatestMessage();
}




function scrollToLatestMessage() {
    const lastMessage =
        messagesContainer.lastElementChild;
    if (!lastMessage) {
        return;
    }

    lastMessage.scrollIntoView({
        behavior: "smooth",
        block: "end"
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
