import { ChatMessage, Coffee } from "@/types";

export async function chatWithCoffee(
  coffee: Coffee,
  messages: ChatMessage[],
  requestedMode?: "mock" | "real"
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const aiMode = requestedMode ?? (process.env.NEXT_PUBLIC_AI_MODE as "mock" | "real" | undefined);
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

  const systemPrompt = `
You are ${coffee.name}, speaking in first person as a coffee.
Origin: ${coffee.originCountry}, ${coffee.region}
Roast: ${coffee.roastLevel}
Flavor notes: ${coffee.flavorNotes.join(", ")}
Personality: ${coffee.personalityTraits.join(", ")}
Story: ${coffee.storySnippet}

Rules:
- Stay friendly, concise, and in-character.
- Keep answers tied to provided metadata.
- Do not invent precise factual details outside this context.
- If unsure, say you only know your passport profile.
`.trim();

  if (!apiKey || aiMode !== "real") {
    const lastUser = messages.filter((m) => m.role === "user").at(-1)?.content ?? "hello";
    return `I am ${coffee.name}, your ${coffee.roastLevel} roast companion. ${coffee.storySnippet} You asked: "${lastUser}". I'd pair beautifully with something that lets my ${coffee.flavorNotes[0]} and ${coffee.flavorNotes[1]} shine.`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nConversation:\n${messages
                  .map((m) => `${m.role}: ${m.content}`)
                  .join("\n")}`
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini chat request failed", response.status, errorText);
    return `I lost my voice for a second. Gemini returned ${response.status}. Ask me again and I will brew a better answer.`;
  }

  const data = await response.json();
  return (
    (data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined) ??
    "I am here and ready to chat, but my words are still steeping."
  );
}
