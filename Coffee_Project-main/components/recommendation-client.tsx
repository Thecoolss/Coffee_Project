"use client";

import { recommendDrink } from "@/lib/drink-recommendation";
import { saveCurrentRecommendation } from "@/lib/storage";
import { MoodTag, TargetMood, VibeTag } from "@/types";
import { useMemo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

type Props = {
  vibes: VibeTag[];
  summary?: string;
  mood?: MoodTag;
  targetMood?: TargetMood;
  demo?: boolean;
};

export function RecommendationClient({ vibes, summary, mood, targetMood, demo }: Props) {
  const chosenTargetMood = targetMood ?? "happy";

  const recommendation = useMemo(
    () => recommendDrink(mood, chosenTargetMood, vibes),
    [vibes, mood, chosenTargetMood]
  );

  saveCurrentRecommendation(recommendation.primary.id);

  return (
    <section className="space-y-5 pt-4">
      <div>
        <span className="pill pill-soft">
          <Sparkles size={12} /> {demo ? "Demo match" : "Your match"}
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Your coffee recommendation
        </h1>
        {summary ? (
          <p className="mt-1 text-sm text-mocha-600">&ldquo;{summary}&rdquo;</p>
        ) : null}
      </div>

      <div className="card p-4 space-y-3">
        <p className="text-sm text-mocha-500">Detected mood</p>
        <p className="text-lg font-semibold capitalize text-mocha-900">{mood ?? "neutral"}</p>

        <p className="text-sm text-mocha-500">Goal mood</p>
        <p className="text-lg font-semibold capitalize text-mocha-900">{chosenTargetMood}</p>

        <p className="text-sm text-mocha-500">Recommended drink</p>
        <p className="text-2xl font-semibold text-mocha-900">{recommendation.primary.name}</p>

        <p className="text-sm text-mocha-600">{recommendation.primary.description}</p>

        <div className="flex flex-wrap gap-2">
          <span className="chip capitalize">{recommendation.primary.category}</span>
          <span className="chip capitalize">{recommendation.primary.caffeineLevel} caffeine</span>
        </div>

        <p className="text-sm text-mocha-500">{recommendation.reason}</p>
        <p className="text-sm text-mocha-700">{recommendation.primary.orderHint}</p>
      </div>

      <Link
        href={`/nearby?coffee=${encodeURIComponent(recommendation.primary.name)}`}
        className="btn btn-primary w-full"
      >
        Find nearby cafes for this drink
      </Link>

      {recommendation.alternates.length > 0 ? (
        <div className="card p-4">
          <p className="display text-lg font-semibold text-mocha-900">Other good options</p>
          <div className="mt-3 space-y-2">
            {recommendation.alternates.map((drink) => (
              <div
                key={drink.id}
                className="rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3"
              >
                <p className="text-sm font-semibold text-mocha-900">{drink.name}</p>
                <p className="text-xs text-mocha-500">
                  {drink.category} · {drink.caffeineLevel} caffeine
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}