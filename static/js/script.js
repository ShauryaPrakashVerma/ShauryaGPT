const app = document.querySelector(".app");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const newChatBtn = document.getElementById("newChatBtn");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const messagesContainer = document.getElementById("messages");
const suggestions = document.querySelectorAll(".suggestion-card");
const conversationList = document.getElementById("conversationList");
const helpBtn = document.getElementById("helpBtn");
const hero = document.querySelector(".hero");

let conversations = [];
let activeConversationId = null;
let isGenerating = false;

// Create a unique conversation ID

function createConversationId() {
  return (
    Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9)
  );
}

// Create a new conversation object

function createConversation() {
  return {
    id: createConversationId(),
    title: "New conversation",
    preview: "Start a new conversation...",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Create the initial empty conversation

function initializeChat() {
  const conversation = createConversation();

  conversations.push(conversation);

  activeConversationId = conversation.id;

  renderConversationList();

  renderMessages();

  updateChatTitle();
}

// Initialize the application

initializeChat();

// Toggle sidebar

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    app.classList.toggle("sidebar-collapsed");
  });
}

// Create a new chat

if (newChatBtn) {
  newChatBtn.addEventListener("click", () => {
    if (isGenerating) {
      return;
    }

    const conversation = createConversation();

    conversations.push(conversation);

    activeConversationId = conversation.id;

    renderConversationList();

    renderMessages();

    updateChatTitle();

    chatInput.value = "";

    chatInput.style.height = "auto";

    chatInput.focus();
  });
}

// Select a conversation

if (conversationList) {
  conversationList.addEventListener("click", (event) => {
    const item = event.target.closest(".conversation");

    if (!item) {
      return;
    }

    const id = item.dataset.conversationId;

    if (!id) {
      return;
    }

    activeConversationId = id;

    renderConversationList();

    renderMessages();

    updateChatTitle();
  });
}

// Get the active conversation

function getActiveConversation() {
  return conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
}

// Render conversation sidebar

function renderConversationList() {
  if (!conversationList) {
    return;
  }

  conversationList.innerHTML = "";

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  sorted.forEach((conversation) => {
    const item = document.createElement("button");

    item.classList.add("conversation");

    item.dataset.conversationId = conversation.id;

    if (conversation.id === activeConversationId) {
      item.classList.add("active");
    }

    const title = escapeHTML(conversation.title);

    const preview = escapeHTML(conversation.preview);

    item.innerHTML = `
                <div class="conversation-content">
                    <span class="conversation-title">
                        ${title}
                    </span>

                    <span class="conversation-preview">
                        ${preview}
                    </span>
                </div>

                <span class="conversation-time">
                    ${formatConversationTime(conversation.updatedAt)}
                </span>
            `;

    conversationList.appendChild(item);
  });
}

// Update sidebar information

function updateConversationInfo(conversation, message) {
  if (conversation.messages.length === 1) {
    conversation.title =
      message.length > 35 ? message.substring(0, 35) + "..." : message;
  }

  conversation.preview =
    message.length > 45 ? message.substring(0, 45) + "..." : message;

  conversation.updatedAt = new Date().toISOString();
}

// Update chat title

function updateChatTitle() {
  const chatTitle = document.querySelector(".chat-title");

  if (!chatTitle) {
    return;
  }

  const conversation = getActiveConversation();

  if (!conversation) {
    return;
  }

  chatTitle.textContent = conversation.title;
}

// Render all messages in active conversation

function renderMessages() {
  if (!messagesContainer) {
    return;
  }

  const conversation = getActiveConversation();

  if (!conversation) {
    return;
  }

  messagesContainer.innerHTML = "";

  if (conversation.messages.length === 0) {
    showHero();

    return;
  }

  hideHero();

  conversation.messages.forEach((message) => {
    addMessageToDOM(message.text, message.type, false, message.timestamp);
  });

  scrollToLatestMessage("auto");
}

// Show startup hero

function showHero() {
  if (hero) {
    hero.classList.remove("hidden");
  }

  messagesContainer.classList.remove("has-messages");
}

// Hide startup hero

function hideHero() {
  if (hero) {
    hero.classList.add("hidden");
  }

  messagesContainer.classList.add("has-messages");
}

// Add message to the DOM

function addMessageToDOM(text, type, shouldScroll = true, timestamp = null) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", type);

  const avatar = document.createElement("div");

  avatar.classList.add("message-avatar");

  avatar.textContent = type === "user" ? "YOU" : "AI";

  const messageBody = document.createElement("div");

  messageBody.classList.add("message-body");

  const content = document.createElement("div");

  content.classList.add("message-content");

  if (type === "bot") {
    if (typeof marked !== "undefined") {
      content.innerHTML = marked.parse(text);
    } else {
      content.textContent = text;
    }
  } else {
    content.textContent = text;
  }

  const timeElement = document.createElement("div");

  timeElement.classList.add("message-time");

  const time = timestamp ? new Date(timestamp) : new Date();

  timeElement.textContent = formatMessageTime(time);

  messageBody.appendChild(content);

  messageBody.appendChild(timeElement);

  messageElement.appendChild(avatar);

  messageElement.appendChild(messageBody);

  messagesContainer.appendChild(messageElement);

  if (shouldScroll) {
    scrollToLatestMessage("smooth");
  }
}

// Create empty streaming message

function createStreamingMessage() {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", "bot", "streaming-message");

  const avatar = document.createElement("div");

  avatar.classList.add("message-avatar");

  avatar.textContent = "AI";

  const messageBody = document.createElement("div");

  messageBody.classList.add("message-body");

  const content = document.createElement("div");

  content.classList.add("message-content", "streaming-content");

  content.textContent = "";

  const timeElement = document.createElement("div");

  timeElement.classList.add("message-time");

  timeElement.textContent = formatMessageTime(new Date());

  messageBody.appendChild(content);

  messageBody.appendChild(timeElement);

  messageElement.appendChild(avatar);

  messageElement.appendChild(messageBody);

  messagesContainer.appendChild(messageElement);

  scrollToLatestMessage("auto");

  return messageElement;
}

// Update streaming message

function updateStreamingMessage(messageElement, text) {
  const content = messageElement.querySelector(".streaming-content");

  if (!content) {
    return;
  }

  content.textContent = text;

  requestAnimationFrame(() => {
    scrollDuringStreaming();
  });
}

// Finalize streaming message

function finalizeStreamingMessage(messageElement, text) {
  const content = messageElement.querySelector(".streaming-content");

  if (!content) {
    return;
  }

  if (typeof marked !== "undefined") {
    content.innerHTML = marked.parse(text);
  } else {
    content.textContent = text;
  }

  content.classList.remove("streaming-content");

  messageElement.classList.remove("streaming-message");

  scrollToLatestMessage("smooth");
}

// Show typing indicator

function showTypingIndicator() {
  hideTypingIndicator();

  const typingElement = document.createElement("div");

  typingElement.id = "typingIndicator";

  typingElement.classList.add("message", "bot", "typing-message");

  typingElement.innerHTML = `
        <span class="typing-label">
            AI is typing
        </span>

        <span class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;

  messagesContainer.appendChild(typingElement);

  scrollToLatestMessage("auto");
}

// Hide typing indicator

function hideTypingIndicator() {
  const typingElement = document.getElementById("typingIndicator");

  if (typingElement) {
    typingElement.remove();
  }
}

// Send message

async function sendMessage() {
  if (isGenerating) {
    return;
  }

  const message = chatInput.value.trim();

  if (!message) {
    return;
  }

  const conversation = getActiveConversation();

  if (!conversation) {
    return;
  }

  isGenerating = true;

  sendBtn.disabled = true;

  const timestamp = new Date().toISOString();

  // Add user message to memory

  conversation.messages.push({
    type: "user",

    text: message,

    timestamp: timestamp,
  });

  updateConversationInfo(conversation, message);

  // Hide startup screen

  hideHero();

  // Clear input

  chatInput.value = "";

  chatInput.style.height = "auto";

  // Update sidebar

  renderConversationList();

  updateChatTitle();

  // Display user message

  addMessageToDOM(message, "user", true, timestamp);

  try {
    // Show typing indicator

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

    if (!response.body) {
      throw new Error("Streaming is not supported.");
    }

    // Remove typing indicator

    hideTypingIndicator();

    // Create empty AI message

    const botMessageElement = createStreamingMessage();

    const reader = response.body.getReader();

    const decoder = new TextDecoder("utf-8");

    let botResponse = "";

    // Read streamed response

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, {
        stream: true,
      });

      if (!chunk) {
        continue;
      }

      botResponse += chunk;

      // Update AI message

      updateStreamingMessage(botMessageElement, botResponse);

      // Keep newest content visible

      scrollDuringStreaming();
    }

    // Flush decoder

    botResponse += decoder.decode();

    // Save complete AI response

    conversation.messages.push({
      type: "bot",

      text: botResponse,

      timestamp: new Date().toISOString(),
    });

    conversation.updatedAt = new Date().toISOString();

    // Update sidebar

    renderConversationList();

    // Render final Markdown

    finalizeStreamingMessage(botMessageElement, botResponse);
  } catch (error) {
    console.error("Chat error:", error);

    hideTypingIndicator();

    const streamingMessage =
      messagesContainer.querySelector(".streaming-message");

    if (streamingMessage) {
      streamingMessage.remove();
    }

    // Display actual error

    const errorMessage = "Sorry, I couldn't generate a response right now.";

    const errorTimestamp = new Date().toISOString();

    conversation.messages.push({
      type: "bot",

      text: errorMessage,

      timestamp: errorTimestamp,
    });

    conversation.updatedAt = errorTimestamp;

    addMessageToDOM(errorMessage, "bot", true, errorTimestamp);

    renderConversationList();
  } finally {
    isGenerating = false;

    sendBtn.disabled = false;

    chatInput.focus();
  }
}

// Scroll to latest message

function scrollToLatestMessage(behavior = "smooth") {
  requestAnimationFrame(() => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,

      behavior: behavior,
    });
  });
}

// Progressive scroll during streaming

function scrollDuringStreaming() {
  requestAnimationFrame(() => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "auto",
    });
  });
}

// Format message time

function formatMessageTime(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Format sidebar conversation time

function formatConversationTime(timestamp) {
  const date = new Date(timestamp);

  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
}

// Escape HTML

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Resize textarea

function resizeTextarea() {
  chatInput.style.height = "auto";

  chatInput.style.height = Math.min(chatInput.scrollHeight, 150) + "px";
}

chatInput.addEventListener("input", resizeTextarea);

// Send using Enter

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    sendMessage();
  }
});

// Send button

sendBtn.addEventListener("click", sendMessage);

// Suggestion cards

document.addEventListener("click", (event) => {
  const suggestion = event.target.closest(".suggestion-card");

  if (!suggestion) {
    return;
  }

  const question = suggestion.getAttribute("data-question");

  if (!question) {
    console.error("Suggestion is missing data-question:", suggestion);
    return;
  }

  chatInput.value = question;

  resizeTextarea();

  chatInput.focus();
});

// Help button

if (helpBtn) {
  helpBtn.addEventListener("click", () => {
    alert(
      "Ask the portfolio bot about experience, " +
        "technical skills, projects, education, " +
        "or career interests.",
    );
  });
}

// Focus input when page loads

window.addEventListener("load", () => {
  chatInput.focus();
});





// THEME TOGGLE

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    if (theme === "light") {
        document.body.setAttribute("data-theme", "light");

        if (themeToggle) {
            themeToggle.textContent = "☾";
            themeToggle.setAttribute("aria-label", "Switch to dark theme");
        }
    } else {
        document.body.removeAttribute("data-theme");

        if (themeToggle) {
            themeToggle.textContent = "☀";
            themeToggle.setAttribute("aria-label", "Switch to light theme");
        }
    }
}

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";

applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.body.getAttribute("data-theme") === "light"
                ? "light"
                : "dark";

        const newTheme = currentTheme === "dark" ? "light" : "dark";

        localStorage.setItem("portfolio-theme", newTheme);

        applyTheme(newTheme);
    });
}