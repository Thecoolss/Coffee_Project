import { drinks } from "@/data/drinks";
import { MoodTag, TargetMood, VibeTag } from "@/types";

export function recommendDrink(
  currentMood: MoodTag | undefined,
  targetMood: TargetMood,
  vibes: VibeTag[]
) {
  const scored = drinks
    .map((drink) => {
      let score = 0;

      if (currentMood && drink.worksForCurrentMoods.includes(currentMood)) {
        score += 3;
      }

      if (drink.supportsTargetMoods.includes(targetMood)) {
        score += 5;
      }

      const overlap = drink.vibeTags.filter((tag) => vibes.includes(tag));
      score += overlap.length * 2;

      return {
        drink,
        score,
        overlap,
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternates = scored.slice(1, 4).map((item) => item.drink);

  return {
    primary: best.drink,
    alternates,
    reason:
      currentMood
        ? `Based on your current mood (${currentMood}) and your goal to feel ${targetMood}.`
        : `Based on your goal to feel ${targetMood}.`,
    matchedTags: best.overlap,
  };
}