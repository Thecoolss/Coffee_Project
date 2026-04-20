export const config = {
  aiMode: process.env.NEXT_PUBLIC_AI_MODE ?? "mock",
  placesEnabled: process.env.NEXT_PUBLIC_ENABLE_PLACES === "true",
  placesApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY
};

export const isRealAiMode = () => config.aiMode === "real" && Boolean(config.geminiApiKey);
