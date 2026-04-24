"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const KEY = "bean-there-ai-mode";

export function getClientAiMode(): "mock" | "real" {
  if (typeof window === "undefined") return "mock";
  const value = localStorage.getItem(KEY);
  if (value === "real" || value === "mock") return value;
  return process.env.NEXT_PUBLIC_AI_MODE === "real" ? "real" : "mock";
}

export function ModeToggle() {
  const [mode, setMode] = useState<"mock" | "real">("mock");

  useEffect(() => {
    setMode(getClientAiMode());
  }, []);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[rgba(253,249,243,0.6)] px-3 py-2">
      <div className="flex items-center gap-2 text-xs">
        <Sparkles size={14} className="text-mocha-600" />
        <span className="font-medium text-mocha-700">AI Engine</span>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-cream-100 p-1">
        {(["mock", "real"] as const).map((value) => (
          <button
            key={value}
            onClick={() => {
              setMode(value);
              localStorage.setItem(KEY, value);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
              mode === value
                ? "bg-mocha-700 text-cream-50 shadow-sm"
                : "text-mocha-600/70 hover:text-mocha-700"
            }`}
          >
            {value === "mock" ? "Demo" : "Gemini"}
          </button>
        ))}
      </div>
    </div>
  );
}
