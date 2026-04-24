"use client";

import { CoffeeCard } from "@/components/coffee-card";
import { recommendCoffee } from "@/lib/recommendation";
import { recommendDrink } from "@/lib/drink-recommendation";
import {
  getPassport,
  saveCurrentRecommendation,
  saveLastRecommendation,
  unlockCoffee
} from "@/lib/storage";
import { MoodTag, TargetMood, VibeTag } from "@/types";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, MessageCircle, Sparkles } from "lucide-react";

type Props = {
  vibes: VibeTag[];
  summary?: string;
  mood?: MoodTag;
  targetMood?: TargetMood;
  demo?: boolean;
};

export function RecommendationClient({ vibes, summary, mood, targetMood, demo }: Props) {
  const recommendation = useMemo(() => recommendCoffee(vibes, mood), [vibes, mood]);
  const drinkPlan = useMemo(
    () => recommendDrink(mood, targetMood ?? "happy", vibes),
    [mood, targetMood, vibes]
  );
  const [showStampToast, setShowStampToast] = useState(false);

  useEffect(() => {
    saveCurrentRecommendation(recommendation.primary.id);
    saveLastRecommendation({
      coffeeId: recommendation.primary.id,
      vibes,
      summary,
      mood,
      targetMood,
      savedAt: Date.now()
    });

    const passportBefore = getPassport();
    const alreadyUnlocked = passportBefore.unlockedCoffeeIds.includes(recommendation.primary.id);
    unlockCoffee(recommendation.primary.id, recommendation.primary.originCountry);
    if (!alreadyUnlocked) {
      setShowStampToast(true);
      const timer = setTimeout(() => setShowStampToast(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [recommendation.primary.id, recommendation.primary.originCountry, vibes, summary, mood, targetMood]);

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
          <p className="mt-1 text-sm text-mocha-600">
            Why from your photo: &ldquo;{summary}&rdquo;
          </p>
        ) : null}
      </div>

      <CoffeeCard
        coffee={recommendation.primary}
        featured
        reason={`Why this match: ${recommendation.reason}`}
        showQuickActions={false}
      />

      {showStampToast ? (
        <div className="card-elevated animate-pop p-3">
          <p className="text-sm font-semibold text-mocha-900">
            ✨ Passport stamped: {recommendation.primary.stampIcon} {recommendation.primary.originCountry}
          </p>
          <p className="mt-1 text-xs text-mocha-600">New stamp added to your passport booklet.</p>
        </div>
      ) : null}

      <div className="card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">
          Photo vibe tags
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {vibes.map((vibe) => (
            <span key={vibe} className="chip capitalize">
              {vibe}
            </span>
          ))}
          {mood ? <span className="chip capitalize">mood: {mood}</span> : null}
          {targetMood ? <span className="chip capitalize">goal: {targetMood}</span> : null}
        </div>
      </div>

      <div className="card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">
          Best order for this vibe
        </p>
        <p className="mt-1 text-lg font-semibold text-mocha-900">{drinkPlan.primary.name}</p>
        <p className="mt-1 text-sm text-mocha-600">{drinkPlan.primary.description}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="chip capitalize">{drinkPlan.primary.category}</span>
          <span className="chip capitalize">{drinkPlan.primary.caffeineLevel} caffeine</span>
        </div>
        <p className="mt-2 text-sm text-mocha-700">{drinkPlan.primary.orderHint}</p>
      </div>

      <Link
        href={`/chat/${recommendation.primary.id}`}
        className="btn btn-primary w-full"
      >
        <MessageCircle size={16} /> Chat with this coffee
      </Link>

      <Link href="/nearby" className="btn btn-ghost w-full">
        <MapPin size={16} /> Nearby cafes tab
      </Link>

      {recommendation.alternates.length > 0 ? (
        <div className="card p-4">
          <p className="display text-lg font-semibold text-mocha-900">Other good options</p>
          <div className="mt-3 space-y-2">
            {recommendation.alternates.map((coffee) => (
              <div
                key={coffee.id}
                className="rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3"
              >
                <p className="text-sm font-semibold text-mocha-900">{coffee.name}</p>
                <p className="text-xs text-mocha-500">
                  {coffee.originCountry} · {coffee.roastLevel} roast
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}