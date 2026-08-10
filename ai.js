/* Grandpa Assistant AI
   Uses Puter.js so no API key is stored in this repository.
*/

let aiConversation = [];

function addAIMessage(role, content) {
  aiConversation.push({ role, content });
  if (aiConversation.length > 12) {
    aiConversation = aiConversation.slice(-12);
  }
}

async function askGrandpaAI(question) {
  const status = document.getElementById("status");
  const heard = document.getElementById("heard");

  if (!question || !question.trim()) {
    speak("What would you like to ask me?");
    return;
  }

  const cleanQuestion = question.trim();
  heard.textContent = "You said: " + cleanQuestion;
  status.textContent = "🧠 Thinking...";

  addAIMessage("user", cleanQuestion);

  try {
    const response = await puter.ai.chat([
      {
        role: "system",
        content:
          "You are Grandpa Assistant, a friendly, patient voice assistant for an older adult. " +
          "Give clear, useful answers in plain language. Keep answers reasonably short because they will be spoken aloud. " +
          "Never pretend to have called emergency services or contacted a person unless the website actually did so."
      },
      ...aiConversation
    ]);

    let answer = "Sorry, I couldn't think of an answer right now.";

    if (typeof response === "string") {
      answer = response;
    } else if (response && response.message && response.message.content) {
      answer = response.message.content;
    } else if (response && response.content) {
      answer = response.content;
    }

    if (Array.isArray(answer)) {
      answer = answer.map(part => part.text || "").join(" ");
    }

    answer = String(answer).trim();

    addAIMessage("assistant", answer);
    speak(answer);

  } catch (error) {
    console.error("AI error:", error);
    status.textContent = "❌ AI connection error";
    speak("Sorry, I couldn't connect to the AI right now.");
  }
}

function openAIChat() {
  const question = prompt("What would you like to ask Grandpa Assistant?");
  if (question) {
    askGrandpaAI(question);
  }
}

function handleAICommand(text) {
  const lower = text.toLowerCase().trim();

  const aiTriggers = [
    "ask ai",
    "ask the ai",
    "ask assistant",
    "tell me about",
    "explain",
    "who is",
    "what is",
    "why is",
    "how does",
    "can you tell me"
  ];

  if (aiTriggers.some(trigger => lower.startsWith(trigger))) {
    askGrandpaAI(text);
    return true;
  }

  return false;
}
