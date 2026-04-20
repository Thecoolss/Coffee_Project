import { VibeTag } from "@/types";

type AnalyzeResult = {
  vibes: VibeTag[];
  summary: string;
};

const fallbackVibes: VibeTag[] = ["cozy", "playful", "calm"];
const validVibes = ["bold", "cozy", "adventurous", "calm", "minimal", "vibrant", "elegant", "playful"];

export async function analyzePhotoVibe(
  imageBase64: string,
  mimeType = "image/jpeg",
  requestedMode?: "mock" | "real"
): Promise<AnalyzeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const aiMode = requestedMode ?? (process.env.NEXT_PUBLIC_AI_MODE as "mock" | "real" | undefined);
  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

  if (!apiKey || aiMode !== "real") {
    return {
      vibes: fallbackVibes,
      summary: "Demo mode used a playful baseline vibe set."
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          responseMimeType: "application/json"
        },
        contents: [
          {
            parts: [
              {
                text:
                  "You are a safe style assistant. Return JSON only with keys vibes (array) and summary (string). " +
                  "Pick up to 3 from: bold, cozy, adventurous, calm, minimal, vibrant, elegant, playful. " +
                  "Frame as playful style vibes only, never infer identity, sensitive traits, or attractiveness."
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64
                }
              }
            ]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini vibe request failed", response.status, errorText);
    return {
      vibes: fallbackVibes,
      summary: `AI analysis unavailable (${response.status}), so demo fallback vibes were used.`
    };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
  if (!text) {
    return {
      vibes: fallbackVibes,
      summary: "AI response was empty, so fallback vibes were used."
    };
  }

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as AnalyzeResult;
    const valid = (parsed.vibes ?? []).filter((v): v is VibeTag => validVibes.includes(v));
    return {
      vibes: valid.length > 0 ? valid : fallbackVibes,
      summary: parsed.summary || "Style vibes generated."
    };
  } catch {
    return {
      vibes: fallbackVibes,
      summary: "Could not parse AI output, so fallback vibes were used."
    };
  }
}
