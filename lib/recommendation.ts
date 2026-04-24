import { coffees } from "@/data/coffees";
import { MoodTag, RecommendationResult, VibeTag } from "@/types";

const moodBias: Record<MoodTag, VibeTag[]> = {
  focused: ["minimal", "calm"],
  social: ["vibrant", "playful"],
  relaxed: ["cozy", "calm"],
  creative: ["adventurous", "elegant"],
  tired: ["bold", "vibrant"],
  stressed: ["cozy", "calm"],
  happy: ["playful", "vibrant"],
  sleepy: ["bold", "minimal"],
  neutral: ["calm", "minimal"],
  energetic: ["bold", "adventurous"],
  sad: ["cozy", "calm"],
};

export function recommendCoffee(
  inputVibes: VibeTag[],
  mood?: MoodTag
): RecommendationResult {
  const vibes = [...new Set(inputVibes)];
  const boosted = mood ? [...vibes, ...moodBias[mood]] : vibes;

  const scored = coffees
    .map((coffee) => {
      const overlap = coffee.vibeTags.filter((tag) => boosted.includes(tag));
      const score = overlap.reduce(
        (acc, tag) => acc + (vibes.includes(tag) ? 2 : 1),
        0
      );

      return { coffee, score, overlap };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternates = scored.slice(1, 3).map((s) => s.coffee);

  return {
    primary: best.coffee,
    alternates,
    score: best.score,
    matchedTags: best.overlap,
    reason:
      best.overlap.length > 0
        ? `Matched vibes: ${best.overlap.join(", ")}`
        : "Picked for balanced flavor and broad vibe compatibility.",
  };
}