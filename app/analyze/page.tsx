"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoodTag, VibeTag } from "@/types";
import { getClientAiMode } from "@/components/mode-toggle";
import { ImagePlus, Sparkles, Wand2 } from "lucide-react";

const moods: { id: MoodTag; label: string; emoji: string }[] = [
  { id: "focused", label: "Focused", emoji: "🎯" },
  { id: "social", label: "Social", emoji: "🫶" },
  { id: "relaxed", label: "Relaxed", emoji: "🌿" },
  { id: "creative", label: "Creative", emoji: "✨" }
];

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mood, setMood] = useState<MoodTag | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(next: File | null) {
    setFile(next);
    if (next) {
      const url = URL.createObjectURL(next);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleAnalyze() {
    if (!file) return setError("Please upload a photo first.");
    setLoading(true);
    setError(null);

    try {
      const base64 = await toBase64(file);
      const imageBase64 = base64.split(",")[1] ?? "";
      const mode = getClientAiMode();
      console.log("[Analyze] click", {
        fileName: file.name,
        fileType: file.type || "image/jpeg",
        fileSize: file.size,
        mood,
        mode
      });
      const response = await fetch("/api/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType: file.type || "image/jpeg", mode })
      });
      const result = (await response.json()) as { vibes: VibeTag[]; summary: string };
      console.log("[Analyze] response", {
        ok: response.ok,
        status: response.status,
        result
      });

      const params = new URLSearchParams();
      params.set("vibes", result.vibes.join(","));
      params.set("summary", result.summary);
      if (mood) params.set("mood", mood);
      router.push(`/recommendation?${params.toString()}`);
    } catch (error) {
      console.error("[Analyze] request failed", error);
      setError("Could not analyze image right now. Try demo mode.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-5 pt-4">
      <div>
        <span className="pill pill-soft">
          <Sparkles size={12} /> Step 1 of 3
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Find your vibe
        </h1>
        <p className="mt-1 text-sm text-mocha-600">
          Upload a photo to match a coffee style. This is playful &mdash; not scientific.
        </p>
      </div>

      <label
        htmlFor="vibe-file"
        className="card relative block cursor-pointer overflow-hidden p-0 transition hover:border-[var(--line-strong)]"
      >
        {previewUrl ? (
          <div className="relative h-56 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mocha-900/60 via-mocha-900/10 to-transparent p-3 text-xs text-cream-50">
              Tap to change photo
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,199,125,0.35)] text-mocha-700">
              <ImagePlus size={24} />
            </div>
            <p className="text-sm font-semibold text-mocha-800">Tap to upload photo</p>
            <p className="text-xs text-mocha-500">JPG or PNG, anything you like</p>
          </div>
        )}
        <input
          id="vibe-file"
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
      </label>

      <div className="card p-4">
        <p className="text-sm font-semibold text-mocha-800">How are you feeling?</p>
        <p className="text-xs text-mocha-500">Optional &mdash; nudges the match</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {moods.map((m) => {
            const active = mood === m.id;
            return (
              <button
                key={m.id}
                className={`chip ${active ? "chip-active" : ""}`}
                onClick={() => setMood((prev) => (prev === m.id ? "" : m.id))}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        onClick={handleAnalyze}
        disabled={loading || !file}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="spinner" /> Brewing match&hellip;
          </>
        ) : (
          <>
            <Wand2 size={18} /> Analyze &amp; recommend
          </>
        )}
      </button>
    </section>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
