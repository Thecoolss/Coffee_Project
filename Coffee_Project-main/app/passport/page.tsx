"use client";

import { coffees } from "@/data/coffees";
import { getPassport } from "@/lib/storage";
import { useEffect, useState } from "react";
import { Award, Globe2 } from "lucide-react";

export default function PassportPage() {
  const [state, setState] = useState(getPassport());

  useEffect(() => {
    setState(getPassport());
  }, []);

  const unlocked = coffees.filter((c) => state.unlockedCoffeeIds.includes(c.id));
  const progress = Math.round((unlocked.length / coffees.length) * 100);

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

      <div className="card-elevated p-5">
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

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-mocha-800">Stamps</h2>
          <span className="text-xs text-mocha-500">
            {unlocked.length} / {coffees.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {coffees.map((coffee) => {
            const isUnlocked = state.unlockedCoffeeIds.includes(coffee.id);
            return (
              <div
                key={coffee.id}
                className={`stamp ${isUnlocked ? "" : "stamp-locked"}`}
                title={coffee.name}
              >
                <span className="text-2xl">{isUnlocked ? coffee.stampIcon : "🔒"}</span>
                <p className="mt-1 line-clamp-1 text-[10px] font-semibold uppercase tracking-wider">
                  {coffee.originCountry}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-mocha-600" />
          <p className="text-sm font-semibold text-mocha-800">Badges</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {state.badges.length === 0 ? (
            <span className="text-sm text-mocha-500">
              No badges yet &mdash; unlock more coffees to earn them.
            </span>
          ) : (
            state.badges.map((badge) => (
              <span key={badge} className="pill pill-gold">
                <Award size={11} /> {badge}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
