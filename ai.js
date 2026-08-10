/* Grandpa Assistant AI
   Puter.js provides the AI connection without putting a private API key in this repo.
*/

let aiConversation = [];

async function askGrandpaAI(question) {
  const status = document.getElementById("status");
  const heard = document.getElementById("heard");

  question = String(question || "").trim();
  if (!question) {
    speak("What would you like to ask me?");
    return;
  }

  heard.textContent = "You said: " + question;
  status.textContent = "🧠 Thinking...";

  aiConversation.push({ role: "user", content: question });
  if (aiConversation.length > 10) aiConversation = aiConversation.slice(-10);

  try {
    if (!window.puter || !puter.ai || !puter.ai.chat) {
      throw new Error("Puter AI is not available");
    }

    const response = await puter.ai.chat([
      {
        role: "system",
        content:
          "You are Grandpa Assistant, a friendly and patient voice assistant. " +
          "Answer questions clearly and accurately in plain language. " +
          "Keep spoken answers fairly short unless the user asks for detail. " +
          "Do not claim that you called emergency services, contacted family, or performed an action unless the website actually did it."
      },
      ...aiConversation
    ]);

    let answer = "Sorry, I couldn't get an answer right now.";

    if (typeof response === "string") {
      answer = response;
    } else if (response?.message?.content) {
      answer = response.message.content;
    } else if (response?.content) {
      answer = response.content;
    }

    if (Array.isArray(answer)) {
      answer = answer.map(part => part?.text || "").join(" ");
    }

    answer = String(answer).trim() || "Sorry, I didn't get an answer.";
    aiConversation.push({ role: "assistant", content: answer });
    speak(answer);
  } catch (error) {
    console.error("Grandpa Assistant AI error:", error);
    status.textContent = "❌ AI unavailable";
    speak("Sorry, I couldn't connect to the AI right now.");
  }
}

function openAIChat() {
  const question = prompt("What would you like to ask Grandpa Assistant?");
  if (question) askGrandpaAI(question);
}
