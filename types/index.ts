export type VibeTag =
  | "bold"
  | "cozy"
  | "adventurous"
  | "calm"
  | "minimal"
  | "vibrant"
  | "elegant"
  | "playful";

export type MoodTag =
  | "focused"
  | "social"
  | "relaxed"
  | "creative"
  | "tired"
  | "stressed"
  | "happy"
  | "sleepy"
  | "neutral"
  | "energetic"
  | "sad";

  export type TargetMood =
  | "happy"
  | "energetic"
  | "calm"
  | "focused"
  | "cozy"
  | "social";

export type Coffee = {
  id: string;
  name: string;
  originCountry: string;
  region: string;
  roastLevel: "light" | "medium" | "dark";
  flavorNotes: string[];
  vibeTags: VibeTag[];
  storySnippet: string;
  personalityTraits: string[];
  stampIcon: string;
  brewMethod: string;
};

export type RecommendationResult = {
  primary: Coffee;
  alternates: Coffee[];
  score: number;
  reason: string;
  matchedTags: VibeTag[];
};

export type PassportState = {
  unlockedCoffeeIds: string[];
  unlockedCountries: string[];
  badges: string[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CafeResult = {
    id: string;
    name: string;
    address: string;
    rating?: number;
    reviewCount?: number;
    isOpenNow?: boolean;
    distanceMeters?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
    photoUrl?: string;
  };

export type VibeAnalysisResult = {
  vibes: VibeTag[];
  mood: MoodTag;
  summary: string;
  energyLevel: "low" | "medium" | "high";
};


export type Drink = {
  id: string;
  name: string;
  category: "hot" | "iced";
  caffeineLevel: "low" | "medium" | "high";
  vibeTags: VibeTag[];
  worksForCurrentMoods: MoodTag[];
  supportsTargetMoods: TargetMood[];
  description: string;
  orderHint: string;
};