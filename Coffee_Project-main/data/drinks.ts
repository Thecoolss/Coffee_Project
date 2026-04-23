import { Drink } from "@/types";

export const drinks: Drink[] = [
  {
    id: "espresso",
    name: "Espresso",
    category: "hot",
    caffeineLevel: "high",
    vibeTags: ["bold", "minimal"],
    worksForCurrentMoods: ["tired", "sleepy", "neutral"],
    supportsTargetMoods: ["energetic", "focused"],
    description: "A strong, concentrated coffee for a fast energy lift.",
    orderHint: "Ask for a double espresso."
  },
  {
    id: "iced-americano",
    name: "Iced Americano",
    category: "iced",
    caffeineLevel: "high",
    vibeTags: ["bold", "minimal", "vibrant"],
    worksForCurrentMoods: ["tired", "sleepy", "stressed"],
    supportsTargetMoods: ["energetic", "focused"],
    description: "Refreshing and strong, ideal when you want clarity and energy.",
    orderHint: "Ask for an iced Americano with no sugar for a clean boost."
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "hot",
    caffeineLevel: "medium",
    vibeTags: ["cozy", "calm", "elegant"],
    worksForCurrentMoods: ["stressed", "sad", "neutral"],
    supportsTargetMoods: ["calm", "happy", "cozy"],
    description: "Balanced espresso and milk foam for comfort and warmth.",
    orderHint: "Ask for a cappuccino with cinnamon if available."
  },
  {
    id: "latte",
    name: "Latte",
    category: "hot",
    caffeineLevel: "medium",
    vibeTags: ["cozy", "calm", "minimal"],
    worksForCurrentMoods: ["sad", "stressed", "relaxed"],
    supportsTargetMoods: ["calm", "cozy", "happy"],
    description: "Smooth and mellow, a comforting coffee for softer moods.",
    orderHint: "Ask for a classic latte."
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "hot",
    caffeineLevel: "medium",
    vibeTags: ["playful", "cozy", "vibrant"],
    worksForCurrentMoods: ["sad", "neutral", "stressed"],
    supportsTargetMoods: ["happy", "cozy"],
    description: "Chocolate and coffee together for an uplifting, indulgent mood boost.",
    orderHint: "Ask for a mocha with whipped cream if you want it extra fun."
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "hot",
    caffeineLevel: "medium",
    vibeTags: ["minimal", "elegant", "calm"],
    worksForCurrentMoods: ["neutral", "focused", "stressed"],
    supportsTargetMoods: ["focused", "calm"],
    description: "Smooth and strong, great when you want calm focus.",
    orderHint: "Ask for a flat white."
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "iced",
    caffeineLevel: "high",
    vibeTags: ["bold", "vibrant", "playful"],
    worksForCurrentMoods: ["tired", "sleepy", "sad"],
    supportsTargetMoods: ["energetic", "happy"],
    description: "Chilled and powerful, ideal for lifting low energy.",
    orderHint: "Ask for a cold brew over ice."
  },
  {
    id: "vanilla-latte",
    name: "Vanilla Latte",
    category: "hot",
    caffeineLevel: "medium",
    vibeTags: ["playful", "cozy", "elegant"],
    worksForCurrentMoods: ["sad", "neutral", "relaxed"],
    supportsTargetMoods: ["happy", "cozy", "social"],
    description: "Soft, sweet, and friendly — a good choice when you want a lighter mood.",
    orderHint: "Ask for a vanilla latte."
  },
  {
    id: "caramel-latte",
    name: "Caramel Latte",
    category: "hot",
    caffeineLevel: "medium",
    vibeTags: ["playful", "vibrant", "cozy"],
    worksForCurrentMoods: ["sad", "stressed", "neutral"],
    supportsTargetMoods: ["happy", "social", "cozy"],
    description: "Sweet and comforting, great for moving toward a happier mood.",
    orderHint: "Ask for a caramel latte."
  },
  {
    id: "decaf-latte",
    name: "Decaf Latte",
    category: "hot",
    caffeineLevel: "low",
    vibeTags: ["calm", "cozy", "minimal"],
    worksForCurrentMoods: ["stressed", "sad", "energetic"],
    supportsTargetMoods: ["calm", "cozy"],
    description: "Comforting without too much stimulation.",
    orderHint: "Ask for a decaf latte if you want comfort without extra caffeine."
  }
];

export const drinkById = Object.fromEntries(drinks.map((drink) => [drink.id, drink]));