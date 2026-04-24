"use client";

import { coffees } from "@/data/coffees";
import { getPassport } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Award, Globe2 } from "lucide-react";

export default function PassportPage() {
  const [state, setState] = useState(getPassport());
  const [page, setPage] = useState(0);

  useEffect(() => {
    setState(getPassport());
  }, []);

  const unlocked = coffees.filter((c) => state.unlockedCoffeeIds.includes(c.id));
  const progress = Math.round((unlocked.length / coffees.length) * 100);
  const stampsPerPage = 6;
  const totalPages = Math.ceil(coffees.length / stampsPerPage);
  const visible = coffees.slice(page * stampsPerPage, page * stampsPerPage + stampsPerPage);

  return (
    <section className="space-y-5 pt-4">
      <div>
        <span className="pill pill-soft">
          <Globe2 size={12} /> Your travels
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Passport
        </h1>
        <p className="mt-1 text-sm text-mocha-600">Every match earns you a stamp.</p>
      </div>

      <div className="card-elevated relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[rgba(232,199,125,0.35)] blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-12 h-28 w-28 rounded-full bg-[rgba(181,105,26,0.2)] blur-2xl" />
        <div className="flex items-center justify-between">
          <div>
            <p className="display text-4xl font-semibold text-mocha-900">{unlocked.length}</p>
            <p className="text-xs uppercase tracking-wider text-mocha-500">Coffees</p>
          </div>
          <div className="text-right">
            <p className="display text-4xl font-semibold text-mocha-900">
              {state.unlockedCountries.length}
            </p>
            <p className="text-xs uppercase tracking-wider text-mocha-500">Origins</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[rgba(77,38,21,0.1)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #b5691a 0%, #e8c77d 100%)"
            }}
          />
        </div>
        <p className="mt-2 text-xs text-mocha-600">{progress}% of the passport filled</p>
      </div>

      <div className="card relative overflow-hidden p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(109,57,31,0.08) 0px, rgba(109,57,31,0.08) 1px, transparent 1px, transparent 22px)"
          }}
        />
        <div className="relative mb-3 flex items-center justify-between">
          <h2 className="display text-lg font-semibold text-mocha-900">Stamp pages</h2>
          <span className="text-xs text-mocha-500">
            {unlocked.length} / {coffees.length}
          </span>
        </div>
        <div className="relative mb-3 flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                page === i
                  ? "border-mocha-700 bg-mocha-700 text-cream-50"
                  : "border-[var(--line)] bg-white/70 text-mocha-700"
              }`}
            >
              Page {i + 1}
            </button>
          ))}
        </div>
        <div className="relative grid grid-cols-3 gap-2">
          {visible.map((coffee) => {
            const isUnlocked = state.unlockedCoffeeIds.includes(coffee.id);
            const rotation = isUnlocked ? ((coffee.id.length % 5) - 2) * 2 : 0;
            return (
              <div
                key={coffee.id}
                className={`stamp transition-transform duration-200 hover:scale-[1.02] ${
                  isUnlocked ? "" : "stamp-locked"
                }`}
                style={isUnlocked ? { transform: `rotate(${rotation}deg)` } : undefined}
                title={coffee.name}
              >
                <span className="text-2xl">{isUnlocked ? coffee.stampIcon : "🔒"}</span>
                <p className="mt-1 line-clamp-1 text-[10px] font-semibold uppercase tracking-wider">
                  {coffee.originCountry}
                </p>
                {isUnlocked ? (
                  <p className="mt-1 text-[9px] font-semibold text-mocha-600/80">
                    {stampDateForId(coffee.id)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="relative mt-3 text-xs text-mocha-600">
          Tip: each new recommendation can unlock another passport stamp.
        </p>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-mocha-600" />
          <p className="text-sm font-semibold text-mocha-800">Visa stickers</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {state.badges.length === 0 ? (
            <span className="text-sm text-mocha-500">
              No badges yet &mdash; unlock more coffees to earn them.
            </span>
          ) : (
            state.badges.map((badge, index) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(109,57,31,0.22)] bg-gradient-to-br from-gold/70 to-amber-100 px-3 py-2 text-xs font-semibold text-mocha-900 shadow-[0_8px_20px_-14px_rgba(77,38,21,0.6)]"
                style={{ transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)` }}
              >
                <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-mocha-700">
                  Visa
                </span>
                <Award size={11} /> {badge}
              </span>
            ))
          )}
        </div>
        <div className="mt-3 rounded-xl border border-[var(--line)] bg-white/60 px-3 py-2 text-xs text-mocha-600">
          <p className="font-semibold text-mocha-800">How visas are earned</p>
          <p className="mt-1">First Flight: 3 coffees · World Sipper: 5 origins · Passport Pro: 10 coffees</p>
        </div>
      </div>
    </section>
  );
}

function stampDateForId(id: string): string {
  const checksum = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const day = (checksum % 27) + 1;
  const month = (checksum % 12) + 1;
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/26`;
}
