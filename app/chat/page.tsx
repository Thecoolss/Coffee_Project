"use client";

import Link from "next/link";
import { coffees } from "@/data/coffees";
import { getCurrentRecommendation, getPassport } from "@/lib/storage";
import { useEffect, useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";

export default function ChatIndexPage() {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    setTargetId(getCurrentRecommendation());
    setUnlockedIds(getPassport().unlockedCoffeeIds);
  }, []);

  const target = coffees.find((c) => c.id === targetId) ?? coffees[0];
  const unlocked = coffees.filter((c) => unlockedIds.includes(c.id));

  return (
    <section className="space-y-5 pt-4">
      <div>
        <span className="pill pill-soft">
          <Sparkles size={12} /> Chat
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Talk with a coffee
        </h1>
        <p className="mt-1 text-sm text-mocha-600">
          Each coffee has its own personality based on its origin and roast.
        </p>
      </div>

      <Link href={`/chat/${target.id}`} className="card-elevated block p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">
          Current match
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="min-w-0">
            <p className="display text-xl font-semibold text-mocha-900">{target.name}</p>
            <p className="text-xs text-mocha-500">
              {target.originCountry} · {target.roastLevel}
            </p>
          </div>
          <span className="text-4xl">{target.stampIcon}</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mocha-700">
          Start chatting <MessageCircle size={14} />
        </div>
      </Link>

      {unlocked.length > 1 ? (
        <div className="card p-4">
          <p className="text-sm font-semibold text-mocha-800">Your unlocked coffees</p>
          <div className="mt-3 space-y-2">
            {unlocked.map((c) => (
              <Link
                key={c.id}
                href={`/chat/${c.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3 transition hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.stampIcon}</span>
                  <div>
                    <p className="text-sm font-semibold text-mocha-900">{c.name}</p>
                    <p className="text-xs text-mocha-500">{c.originCountry}</p>
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
