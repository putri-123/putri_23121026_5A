// GANTI DENGAN URL WEBHOOK n8n KAMU
const WEBHOOK_URL = "https://n8n-re9macilutpq.kol.sumopod.my.id/webhook/toko-makeup";

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navItems = navLinks.querySelectorAll("li");

const startChatBtn = document.getElementById("startChat");
const chatbox = document.getElementById("chatbox");

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

/* HAMBURGER */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

navItems.forEach(item => {
  item.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

/* SCROLL TO CHAT */
startChatBtn.addEventListener("click", () => {
  chatbox.scrollIntoView({ behavior: "smooth" });
});

/* CLEAN MARKDOWN */
function cleanMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^\s*[-*•]\s?/gm, "")
    .trim();
}

/* ADD MESSAGE */
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* SEND MESSAGE */
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  messageInput.value = "";

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const rawText = await response.text();
    console.log("📥 RAW RESPONSE:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      addMessage("Balasan server bukan JSON valid.", "bot");
      return;
    }

    const reply =data.output

    addMessage(cleanMarkdown(reply), "bot");

  } catch (error) {
    console.error("❌ Error:", error);
    addMessage("Server tidak merespon.", "bot");
  }
}
