import { MoodTag, VibeAnalysisResult, VibeTag } from "@/types";

const fallbackVibes: VibeTag[] = ["cozy", "playful", "calm"];
const fallbackMood: MoodTag = "relaxed";

const validVibes: VibeTag[] = [
  "bold",
  "cozy",
  "adventurous",
  "calm",
  "minimal",
  "vibrant",
  "elegant",
  "playful",
];

const validMoods: MoodTag[] = [
  "focused",
  "social",
  "relaxed",
  "creative",
  "tired",
  "stressed",
  "happy",
  "sleepy",
  "neutral",
  "energetic",
  "sad",
];

export async function analyzePhotoVibe(
  imageBase64: string,
  mimeType = "image/jpeg",
  requestedMode?: "mock" | "real"
): Promise<VibeAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const aiMode =
    requestedMode ??
    (process.env.NEXT_PUBLIC_AI_MODE as "mock" | "real" | undefined);
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey || aiMode !== "real") {
    return {
      vibes: fallbackVibes,
      mood: fallbackMood,
      energyLevel: "medium",
      summary: "Demo mode used a playful baseline vibe set.",
    };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              vibes: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                  enum: [
                    "bold",
                    "cozy",
                    "adventurous",
                    "calm",
                    "minimal",
                    "vibrant",
                    "elegant",
                    "playful",
                  ],
                },
              },
              mood: {
                type: "STRING",
                enum: [
                  "focused",
                  "social",
                  "relaxed",
                  "creative",
                  "tired",
                  "stressed",
                  "happy",
                  "sleepy",
                  "neutral",
                  "energetic",
                  "sad",
                ],
              },
              energyLevel: {
                type: "STRING",
                enum: ["low", "medium", "high"],
              },
              summary: {
                type: "STRING",
              },
            },
            required: ["vibes", "mood", "energyLevel", "summary"],
          },
        },
        contents: [
          {
            parts: [
              {
                text:
                  "You are a coffee recommendation AI. " +
                  "Analyze the person's visible facial expression and overall vibe from the selfie. " +
                  "You may infer simple non-medical mood states like tired, sad, stressed, happy, calm, relaxed, or energetic. " +
                  "Do NOT identify the person and do NOT infer sensitive traits such as race, health conditions, religion, or attractiveness. " +
                  "Return JSON only with keys: vibes, mood, energyLevel, summary. " +
                  "vibes must be an array of up to 3 values from: bold, cozy, adventurous, calm, minimal, vibrant, elegant, playful. " +
                  "mood must be one of: focused, social, relaxed, creative, tired, stressed, happy, sleepy, neutral, energetic, sad. " +
                  'energyLevel must be one of: "low", "medium", "high". ' +
                  "summary should be one short sentence clearly matching the mood and coffee suggestion.",
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini vibe request failed", response.status, errorText);

    return {
      vibes: fallbackVibes,
      mood: fallbackMood,
      energyLevel: "medium",
      summary: `AI analysis unavailable (${response.status}), so demo fallback vibes were used.`,
    };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as
    | string
    | undefined;

  if (!text) {
    console.error("Gemini returned empty text:", data);

    return {
      vibes: fallbackVibes,
      mood: fallbackMood,
      energyLevel: "medium",
      summary: "AI response was empty, so fallback vibes were used.",
    };
  }

  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned) as Partial<VibeAnalysisResult>;

    const vibes = Array.isArray(parsed.vibes)
      ? parsed.vibes.filter((v): v is VibeTag => validVibes.includes(v as VibeTag))
      : [];

    const mood = validMoods.includes(parsed.mood as MoodTag)
      ? (parsed.mood as MoodTag)
      : fallbackMood;

    const energyLevel =
      parsed.energyLevel === "low" ||
      parsed.energyLevel === "medium" ||
      parsed.energyLevel === "high"
        ? parsed.energyLevel
        : "medium";

    const summary =
      typeof parsed.summary === "string" && parsed.summary.trim().length > 0
        ? parsed.summary.trim()
        : "Style vibes generated.";

    return {
      vibes: vibes.length > 0 ? vibes : fallbackVibes,
      mood,
      energyLevel,
      summary,
    };
  } catch (err) {
    console.error("Raw Gemini text:", text);
    console.error("JSON parse failed:", err);

    return {
      vibes: fallbackVibes,
      mood: fallbackMood,
      energyLevel: "medium",
      summary: "Could not parse AI output, so fallback vibes were used.",
    };
  }
}