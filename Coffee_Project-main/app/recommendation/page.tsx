import { RecommendationClient } from "@/components/recommendation-client";
import { MoodTag, TargetMood, VibeTag } from "@/types";

type SearchParams = {
  vibes?: string;
  summary?: string;
  mood?: MoodTag;
  targetMood?: TargetMood;
  demo?: string;
};

export default async function RecommendationPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const vibes =
    (resolved.vibes?.split(",").filter(Boolean) as VibeTag[] | undefined) ?? ["cozy", "calm"];

  return (
    <RecommendationClient
      vibes={vibes}
      summary={resolved.summary}
      mood={resolved.mood}
      targetMood={resolved.targetMood}
      demo={resolved.demo === "1"}
    />
  );
}