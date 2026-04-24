"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { coffeeById } from "@/data/coffees";
import {
  clearLastRecommendation,
  getLastRecommendation,
  LastRecommendationContext
} from "@/lib/storage";

export function HomeLatestRecommendation() {
  const [last, setLast] = useState<LastRecommendationContext | null>(null);

  useEffect(() => {
    setLast(getLastRecommendation());
  }, []);

  const recommendationHref = useMemo(() => {
    if (!last) return "/recommendation?demo=1";
    const params = new URLSearchParams();
    params.set("vibes", last.vibes.join(","));
    if (last.summary) params.set("summary", last.summary);
    if (last.mood) params.set("mood", last.mood);
    if (last.targetMood) params.set("targetMood", last.targetMood);
    return `/recommendation?${params.toString()}`;
  }, [last]);

  if (!last) return null;

  const coffee = coffeeById[last.coffeeId];
  if (!coffee) return null;

  return (
    <div className="card-elevated p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">Latest match</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="display truncate text-xl font-semibold text-mocha-900">{coffee.name}</p>
          <p className="truncate text-xs text-mocha-500">
            {coffee.originCountry} · {coffee.roastLevel} roast
          </p>
        </div>
        <span className="text-3xl">{coffee.stampIcon}</span>
      </div>

      {last.summary ? (
        <p className="mt-3 text-sm text-mocha-700">&ldquo;{last.summary}&rdquo;</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={recommendationHref} className="btn btn-ghost">
          <Sparkles size={14} /> Open recommendation
        </Link>
        <Link href={`/chat/${coffee.id}`} className="btn btn-primary">
          <MessageCircle size={14} /> Chat with coffee
        </Link>
      </div>

      <button
        type="button"
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-mocha-600 hover:text-mocha-800"
        onClick={() => {
          clearLastRecommendation();
          setLast(null);
        }}
      >
        <RotateCcw size={12} /> Back to clean home
      </button>
    </div>
  );
}
