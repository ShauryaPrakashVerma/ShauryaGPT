/* =========================================================
   PORTFOLIO CHAT
   =========================================================
   Features:
   1. Startup hero disappears after first message
   2. Every sidebar chat has its own independent history
   3. New Chat creates a completely new conversation
   4. Switching chats restores their messages
   5. Conversations are saved in localStorage
   6. Suggestion buttons directly start a conversation
   7. Existing Flask /chat endpoint is preserved
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const app = document.querySelector(".app");

const menuBtn = document.getElementById("menuBtn");
const newChatBtn = document.getElementById("newChatBtn");

const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const messagesContainer = document.getElementById("messages");

const suggestions = document.querySelectorAll(".suggestion-card");

const helpBtn = document.getElementById("helpBtn");

const conversationList = document.getElementById("conversationList");

const chatTitle = document.querySelector(".chat-title");

const hero = document.querySelector(".hero");

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "shaurya_portfolio_chats_v1";

/* =========================================================
   CONVERSATION DATA
========================================================= */

let conversations = {};

let activeConversationId = null;

let conversationCount = 0;

/* =========================================================
   DEFAULT CONVERSATIONS
========================================================= */

/*
   These are the conversations that appear when the website
   is opened for the first time.
*/

const defaultConversations = {
  "technical-skills": {
    id: "technical-skills",

    title: "What are your core technical...",

    preview: "What are your core technical skills?",

    time: "NOW",

    messages: [
      {
        type: "user",
        text: "What are your core technical skills?",
      },

      {
        type: "bot",
        text: "My core technical skills include **Python, AI/ML, backend development, databases, and intelligent software systems**. I also work with computer vision, reinforcement learning, and LLM-based applications.",
      },
    ],
  },

  "challenging-project": {
    id: "challenging-project",

    title: "Walk me through a challenging...",

    preview: "Walk me through a challenging project.",

    time: "NOW",

    messages: [
      {
        type: "user",
        text: "Walk me through a challenging project.",
      },

      {
        type: "bot",
        text: "One challenging project involved building an **intelligent traffic monitoring and control system** combining computer vision, simulation, and reinforcement learning. The main challenge was coordinating multiple components while keeping the system responsive.",
      },
    ],
  },

  "technical-background": {
    id: "technical-background",

    title: "Technical background",

    preview: "List down the projects",

    time: "TODAY",

    messages: [
      {
        type: "user",
        text: "List down the projects",
      },

      {
        type: "bot",
        text: "My portfolio includes projects across **AI/ML, backend development, automation, computer vision, and intelligent software systems**. Ask me about any specific project and I can walk you through it.",
      },
    ],
  },

  "open-source": {
    id: "open-source",

    title: "Open source & projects",

    preview: "Tell me about your side projects",

    time: "YESTERDAY",

    messages: [
      {
        type: "user",
        text: "Tell me about your side projects",
      },

      {
        type: "bot",
        text: "I enjoy building practical developer tools and AI/ML projects. My work includes Python libraries, automation-oriented tools, and applications that combine software engineering with machine learning.",
      },
    ],
  },

  team: {
    id: "team",

    title: "Team & collaboration",

    preview: "How do you work in a team?",

    time: "AUG 8",

    messages: [
      {
        type: "user",
        text: "How do you work in a team?",
      },

      {
        type: "bot",
        text: "I prefer clear ownership, frequent communication, and small iterative deliverables. I first make sure the requirements are understood, then coordinate interfaces between components and keep progress visible to the team.",
      },
    ],
  },
};

/* =========================================================
   LOAD CONVERSATIONS
========================================================= */

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      conversations = parsed.conversations || {};

      conversationCount = parsed.conversationCount || 0;

      return;
    }
  } catch (error) {
    console.error("Could not load saved conversations:", error);
  }

  /*
       First visit.

       Start with a blank "New conversation"
       plus the example conversations.
    */

  conversations = {};

  Object.keys(defaultConversations).forEach((id) => {
    conversations[id] = JSON.parse(JSON.stringify(defaultConversations[id]));
  });

  /*
       The first conversation is a blank one.
    */

  const newId = "new-1";

  conversations[newId] = {
    id: newId,

    title: "New conversation",

    preview: "Start a new conversation...",

    time: "NOW",

    messages: [],
  };

  activeConversationId = newId;
}

/* =========================================================
   SAVE CONVERSATIONS
========================================================= */

function saveConversations() {
  try {
    localStorage.setItem(
      STORAGE_KEY,

      JSON.stringify({
        conversations: conversations,

        conversationCount: conversationCount,
      }),
    );
  } catch (error) {
    console.error("Could not save conversations:", error);
  }
}

/* =========================================================
   CREATE UNIQUE ID
========================================================= */

function createConversationId() {
  conversationCount++;

  return "chat-" + Date.now() + "-" + conversationCount;
}

/* =========================================================
   GET ACTIVE CONVERSATION
========================================================= */

function getActiveConversation() {
  return conversations[activeConversationId];
}

/* =========================================================
   SIDEBAR TOGGLE
========================================================= */

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    app.classList.toggle("sidebar-collapsed");
  });
}

/* =========================================================
   RENDER SIDEBAR
========================================================= */

function renderConversationList() {
  conversationList.innerHTML = "";

  /*
       Sort conversations so the currently active one
       appears first.
    */

  const conversationArray = Object.values(conversations);

  conversationArray.sort((a, b) => {
    if (a.id === activeConversationId) {
      return -1;
    }

    if (b.id === activeConversationId) {
      return 1;
    }

    return 0;
  });

  conversationArray.forEach((conversation) => {
    const button = document.createElement("button");

    button.classList.add("conversation");

    button.dataset.chatId = conversation.id;

    if (conversation.id === activeConversationId) {
      button.classList.add("active");
    }

    button.innerHTML = `

                <div class="conversation-content">

                    <span class="conversation-title"></span>

                    <span class="conversation-preview"></span>

                </div>

                <span class="conversation-time"></span>

            `;

    button.querySelector(".conversation-title").textContent =
      conversation.title;

    button.querySelector(".conversation-preview").textContent =
      conversation.preview;

    button.querySelector(".conversation-time").textContent = conversation.time;

    conversationList.appendChild(button);
  });
}

/* =========================================================
   UPDATE HERO / CHAT STATE
========================================================= */

function updateChatState() {
  const conversation = getActiveConversation();

  if (!conversation) {
    return;
  }

  const hasMessages = conversation.messages.length > 0;

  /*
       IMPORTANT:

       If there are no messages:
       show the startup hero.

       If there are messages:
       completely hide the startup hero.
    */

  if (hasMessages) {
    hero.classList.add("hidden");

    messagesContainer.classList.add("has-messages");
  } else {
    hero.classList.remove("hidden");

    messagesContainer.classList.remove("has-messages");
  }

  /*
       Update title at the top.
    */

  chatTitle.textContent = conversation.title;
}

/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages() {
  const conversation = getActiveConversation();

  if (!conversation) {
    return;
  }

  /*
       Clear currently displayed messages.
    */

  messagesContainer.innerHTML = "";

  /*
       Render messages belonging ONLY
       to the active conversation.
    */

  conversation.messages.forEach((message) => {
    addMessageToDOM(message.text, message.type, false, message.timestamp);
  });

  updateChatState();

  /*
       Scroll to bottom when switching
       to a conversation containing messages.
    */

  if (conversation.messages.length > 0) {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
  }
}

/* =========================================================
   SIDEBAR CONVERSATION CLICK
========================================================= */

conversationList.addEventListener("click", (event) => {
  const button = event.target.closest(".conversation");

  if (!button) {
    return;
  }

  const id = button.dataset.chatId;

  if (!id || !conversations[id]) {
    return;
  }

  /*
           Switch active conversation.
        */

  activeConversationId = id;

  /*
           Re-render sidebar so active
           styling changes.
        */

  renderConversationList();

  /*
           Load messages belonging
           to this conversation.
        */

  renderMessages();

  /*
           Clear input.
        */

  chatInput.value = "";

  chatInput.style.height = "auto";

  chatInput.focus();
});

/* =========================================================
   NEW CHAT
========================================================= */

newChatBtn.addEventListener("click", () => {
  const id = createConversationId();

  /*
           Create completely independent
           conversation.
        */

  conversations[id] = {
    id: id,

    title: "New conversation",

    preview: "Start a new conversation...",

    time: "NOW",

    messages: [],
  };

  /*
           Make it active.
        */

  activeConversationId = id;

  /*
           Clear input.
        */

  chatInput.value = "";

  chatInput.style.height = "auto";

  /*
           Render blank chat.

           Because messages.length === 0,
           the startup hero will appear again.
        */

  renderConversationList();

  renderMessages();

  chatInput.focus();

  saveConversations();
});

/* =========================================================
   CREATE CHAT TITLE
========================================================= */

function createChatTitle(message) {
  const cleaned = message.trim().replace(/\s+/g, " ");

  if (cleaned.length > 34) {
    return cleaned.substring(0, 34).trimEnd() + "...";
  }

  return cleaned || "New conversation";
}

/* =========================================================
   UPDATE SIDEBAR AFTER MESSAGE
========================================================= */

function updateConversationInfo(conversation, message) {
  /*
       Only the first message determines
       the conversation title.
    */

  if (conversation.messages.length === 1) {
    conversation.title = createChatTitle(message);
  }

  /*
       Preview is always the latest
       user message.
    */

  conversation.preview =
    message.length > 48 ? message.substring(0, 48) + "..." : message;

  conversation.time = "NOW";
}

/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {
  const message = chatInput.value.trim();

  if (!message) {
    return;
  }

  const conversation = getActiveConversation();

  if (!conversation) {
    return;
  }

  /*
       Check whether this is the
       FIRST message in this chat.
    */

  const firstMessage = conversation.messages.length === 0;

  /* =====================================================
       USER MESSAGE
    ===================================================== */

  conversation.messages.push({
    type: "user",
    text: message,
    timestamp: new Date().toISOString(),
  });

  /*
       Update sidebar title/preview.
    */

  updateConversationInfo(conversation, message);

  /*
       Clear input.
    */

  chatInput.value = "";

  chatInput.style.height = "auto";

  /*
       Hide startup screen immediately.

       This is the important transition
       you requested.
    */

  if (firstMessage) {
    hero.classList.add("hidden");

    messagesContainer.classList.add("has-messages");
  }

  /*
       Update sidebar.
    */

  renderConversationList();

  /*
       Display the user message.
    */

  renderMessages();

  /*
       Save immediately.
    */

  saveConversations();

  /* =====================================================
       SEND TO FLASK BACKEND
    ===================================================== */

  try {
    /*
         Show the animated typing indicator
         while Flask/LLM is generating.
      */

    showTypingIndicator();

    const response = await fetch("/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    /*
         Remove "AI is typing..."
         before displaying the real response.
      */

    hideTypingIndicator();

    /*
         Get bot response from Flask.
      */

    const botResponse =
      data.response || "Sorry, I couldn't generate a response.";

    /*
         Save bot response to THIS conversation.

         Timestamp is saved so the original
         message time is preserved.
      */

    conversation.messages.push({
      type: "bot",
      text: botResponse,
      timestamp: new Date().toISOString(),
    });

    saveConversations();

    /*
         IMPORTANT:

         Only display the response if
         the user is still viewing this chat.

         If they switched to another chat
         while Flask was responding,
         don't overwrite the current chat.
      */

    if (activeConversationId === conversation.id) {
      addMessageToDOM(botResponse, "bot", true);
    }
  } catch (error) {
    console.error("Chat error:", error);

    /*
         ALWAYS remove the typing indicator
         if something goes wrong.
      */

    hideTypingIndicator();

    /*
         Fallback response.

         Useful when Flask /chat is unavailable
         during local frontend testing.
      */

    const fallback = generateDemoResponse(message);

    /*
         Save fallback response with timestamp.
      */

    conversation.messages.push({
      type: "bot",
      text: fallback,
      timestamp: new Date().toISOString(),
    });

    saveConversations();

    /*
         Only show it if this conversation
         is still active.
      */

    if (activeConversationId === conversation.id) {
      addMessageToDOM(fallback, "bot", true);
    }
  }
}

/* =========================================================
   ADD MESSAGE TO DOM
========================================================= */

function addMessageToDOM(text, type, shouldScroll = true, timestamp=null) {
  const messageRow = document.createElement("div");

  messageRow.classList.add("message-row", type);

  /* =====================================================
       AVATAR
    ===================================================== */

  const avatar = document.createElement("div");

  avatar.classList.add("message-avatar");

  if (type === "user") {
    /*
           User icon.

           This is an inline SVG, so you don't need
           Font Awesome or another icon library.
        */

    avatar.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                ></circle>

                <path
                    d="M5 20c0-3.8 3.1-6 7-6s7 2.2 7 6"
                ></path>
            </svg>
        `;
  } else {
    /*
           AI icon.
        */

    avatar.innerHTML = `
            <span class="ai-icon">AI</span>
        `;
  }

  /* =====================================================
       MESSAGE BODY
    ===================================================== */

  const messageBody = document.createElement("div");

  messageBody.classList.add("message-body");

  /* =====================================================
       MESSAGE CONTENT
    ===================================================== */

  const messageContent = document.createElement("div");

  messageContent.classList.add("message-content");

  /*
       Bot responses support Markdown.
    */

  if (type === "bot") {
    if (typeof marked !== "undefined") {
      messageContent.innerHTML = marked.parse(text);
    } else {
      messageContent.textContent = text;
    }
  } else {
    /*
           User text remains plain text.
        */

    messageContent.textContent = text;
  }

  /* =====================================================
       TIMESTAMP
    ===================================================== */

  const meta = document.createElement("div");

  meta.classList.add("message-meta");

  const label = type === "user" ? "YOU" : "AI";

  const messageTime = timestamp
    ? formatMessageTime(new Date(timestamp))
    : formatMessageTime(new Date());

  meta.textContent = `${label} · ${messageTime}`;

  /* =====================================================
       ASSEMBLE MESSAGE
    ===================================================== */

  messageBody.appendChild(messageContent);

  messageBody.appendChild(meta);

  messageRow.appendChild(avatar);

  messageRow.appendChild(messageBody);

  messagesContainer.appendChild(messageRow);

  /* =====================================================
       SCROLL
    ===================================================== */

  if (shouldScroll) {
    setTimeout(() => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,

        behavior: "smooth",
      });
    }, 30);
  }
}

/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTypingIndicator() {
  /*
       Don't create multiple indicators.
    */

  if (document.getElementById("typing-indicator")) {
    return;
  }

  const typingRow = document.createElement("div");

  typingRow.id = "typing-indicator";

  typingRow.classList.add("message-row", "bot", "typing-row");

  /* =====================================================
       AI AVATAR
    ===================================================== */

  const avatar = document.createElement("div");

  avatar.classList.add("message-avatar");

  avatar.innerHTML = `
        <span class="ai-icon">
            AI
        </span>
    `;

  /* =====================================================
       TYPING BODY
    ===================================================== */

  const body = document.createElement("div");

  body.classList.add("message-body");

  const typingContent = document.createElement("div");

  typingContent.classList.add("typing-content");

  typingContent.innerHTML = `

        <div class="typing-dots">

            <span></span>
            <span></span>
            <span></span>

        </div>

        <span class="typing-text">
            AI is typing...
        </span>

    `;

  body.appendChild(typingContent);

  typingRow.appendChild(avatar);

  typingRow.appendChild(body);

  messagesContainer.appendChild(typingRow);

  /*
       Scroll to indicator.
    */

  setTimeout(() => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,

      behavior: "smooth",
    });
  }, 20);
}

/* =========================================================
   REMOVE TYPING INDICATOR
========================================================= */

function hideTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");

  if (indicator) {
    indicator.remove();
  }
}

/* =========================================================
   MESSAGE TIME
========================================================= */

function formatMessageTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/* =========================================================
   SUGGESTION BUTTONS
========================================================= */

suggestions.forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    const question = suggestion.dataset.question;

    if (!question) {
      return;
    }

    /*
                   Put question into input.
                */

    chatInput.value = question;

    resizeTextarea();

    /*
                   IMPORTANT:

                   Immediately send it.

                   So clicking a suggestion
                   changes the screen from:

                   HERO

                   to:

                   CHAT
                */

    sendMessage();
  });
});

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
           Enter = send

           Shift + Enter = new line
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

if (helpBtn) {
  helpBtn.addEventListener("click", () => {
    alert(
      "Ask the portfolio bot about experience, technical skills, projects, education, or career interests.",
    );
  });
}

/* =========================================================
   DEMO RESPONSE
========================================================= */

/*
   This is only a fallback.

   Your real Flask /chat response will be used
   whenever the backend responds successfully.
*/

function generateDemoResponse(question) {
  const q = question.toLowerCase();

  if (q.includes("technical") || q.includes("skills")) {
    return "My core technical skills include **Python, AI/ML, backend development, databases, and building intelligent software systems.**";
  }

  if (q.includes("project") || q.includes("challenging")) {
    return "One of my challenging projects involved building an **intelligent traffic monitoring and control system** combining computer vision, simulation, and reinforcement learning.";
  }

  if (q.includes("system design")) {
    return "I approach system design by first defining the requirements and constraints, then breaking the system into modular components and identifying how data flows between them.";
  }

  if (q.includes("ai") || q.includes("ml") || q.includes("machine learning")) {
    return "I have worked with machine learning and AI concepts including **computer vision, YOLO, reinforcement learning, and LLM-based applications.**";
  }

  if (q.includes("role") || q.includes("job")) {
    return "I'm interested in software engineering and AI/ML-oriented roles where I can work on real-world intelligent systems.";
  }

  if (q.includes("deadline") || q.includes("pressure")) {
    return "I handle deadlines by breaking the work into smaller milestones, prioritizing the critical components, and iterating toward a working solution.";
  }

  return "That's a good question. In the complete version of this portfolio bot, this response would be generated by the LLM using the portfolio data.";
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /*
           Load saved chats.
        */

  loadConversations();

  /*
           If no active conversation was
           assigned, use the first one.
        */

  if (!activeConversationId || !conversations[activeConversationId]) {
    const ids = Object.keys(conversations);

    activeConversationId = ids.length > 0 ? ids[ids.length - 1] : null;
  }

  /*
           Render sidebar.
        */

  renderConversationList();

  /*
           Render active chat.
        */

  renderMessages();

  /*
           Focus input.
        */

  chatInput.focus();
});
