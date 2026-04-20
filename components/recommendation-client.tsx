"use client";

import { CoffeeCard } from "@/components/coffee-card";
import { recommendCoffee } from "@/lib/recommendation";
import { saveCurrentRecommendation, unlockCoffee } from "@/lib/storage";
import { MoodTag, VibeTag } from "@/types";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Stamp, Sparkles } from "lucide-react";

type Props = {
  vibes: VibeTag[];
  summary?: string;
  mood?: MoodTag;
  demo?: boolean;
};

export function RecommendationClient({ vibes, summary, mood, demo }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const recommendation = useMemo(() => recommendCoffee(vibes, mood), [vibes, mood]);

  function handleUnlock() {
    unlockCoffee(recommendation.primary.id, recommendation.primary.originCountry);
    saveCurrentRecommendation(recommendation.primary.id);
    setUnlocked(true);
  }

  return (
    <section className="space-y-5 pt-4">
      <div>
        <span className="pill pill-soft">
          <Sparkles size={12} /> {demo ? "Demo match" : "Your match"}
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Meet your coffee
        </h1>
        {summary ? (
          <p className="mt-1 text-sm text-mocha-600">&ldquo;{summary}&rdquo;</p>
        ) : null}
      </div>

      {vibes.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {vibes.map((v) => (
            <span key={v} className="chip capitalize">
              {v}
            </span>
          ))}
        </div>
      ) : null}

      <CoffeeCard coffee={recommendation.primary} reason={recommendation.reason} featured />

      <button onClick={handleUnlock} disabled={unlocked} className="btn btn-primary w-full">
        {unlocked ? (
          <>
            <CheckCircle2 size={18} /> Stamp unlocked
          </>
        ) : (
          <>
            <Stamp size={18} /> Unlock passport stamp
          </>
        )}
      </button>

      {recommendation.alternates.length > 0 ? (
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="display text-lg font-semibold text-mocha-900">Also your vibe</p>
            <span className="text-xs text-mocha-500">Alternate picks</span>
          </div>
          <div className="mt-3 space-y-2">
            {recommendation.alternates.map((coffee) => (
              <Link
                key={coffee.id}
                href={`/coffee/${coffee.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3 transition hover:bg-white"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl">{coffee.stampIcon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-mocha-900">{coffee.name}</p>
                    <p className="text-xs text-mocha-500">
                      {coffee.originCountry} · {coffee.roastLevel} roast
                    </p>
                  </div>
                </div>
                <span className="text-mocha-500">→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
