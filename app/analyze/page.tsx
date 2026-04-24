"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TargetMood, VibeTag, MoodTag } from "@/types";
import { getClientAiMode } from "@/components/mode-toggle";
import { Camera, ImagePlus, Sparkles, Wand2, X } from "lucide-react";

const targetMoods: { id: TargetMood; label: string; emoji: string }[] = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "energetic", label: "Energetic", emoji: "⚡" },
  { id: "calm", label: "Calm", emoji: "🌿" },
  { id: "focused", label: "Focused", emoji: "🎯" },
  { id: "cozy", label: "Cozy", emoji: "☕" },
  { id: "social", label: "Social", emoji: "🫶" }
];

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetMood, setTargetMood] = useState<TargetMood | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function handleFile(next: File | null) {
    stopCamera();
    setCameraError(null);
    setFile(next);
    if (next) {
      const url = URL.createObjectURL(next);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  }

  async function startCamera() {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("This browser does not support direct camera capture.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      streamRef.current = stream;
      setCameraOpen(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {
            setCameraError("Could not start camera preview.");
          });
        }
      });
    } catch (err) {
      console.error("[Camera] failed to start", err);
      setCameraError("Camera access was denied or unavailable.");
    }
  }

  function captureFromCamera() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("Could not capture frame from camera.");
      return;
    }
    ctx.drawImage(video, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Camera capture failed.");
          return;
        }
        const captured = new File([blob], `camera-${Date.now()}.jpg`, {
          type: "image/jpeg"
        });
        handleFile(captured);
      },
      "image/jpeg",
      0.92
    );
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
        targetMood,
        mode
      });

      const response = await fetch("/api/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type || "image/jpeg",
          mode
        })
      });

      const result = (await response.json()) as {
        vibes: VibeTag[];
        summary: string;
        mood?: MoodTag;
        energyLevel?: "low" | "medium" | "high";
      };

      console.log("[Analyze] response", {
        ok: response.ok,
        status: response.status,
        result
      });

      const params = new URLSearchParams();
      params.set("vibes", result.vibes.join(","));
      params.set("summary", result.summary);

      if (result.mood) params.set("mood", result.mood);
      if (targetMood) params.set("targetMood", targetMood);

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
        htmlFor="vibe-file-upload"
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
          id="vibe-file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label
          htmlFor="vibe-file-upload"
          className="btn btn-ghost w-full cursor-pointer justify-center"
        >
          Upload a photo
        </label>
        <button type="button" onClick={startCamera} className="btn btn-primary w-full justify-center">
          <Camera size={16} /> Take photo
        </button>
      </div>

      {cameraOpen ? (
        <div className="card space-y-3 p-3">
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-black">
            <video
              ref={videoRef}
              className="h-56 w-full object-cover"
              autoPlay
              playsInline
              muted
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={captureFromCamera} className="btn btn-primary w-full">
              <Camera size={16} /> Capture
            </button>
            <button type="button" onClick={stopCamera} className="btn btn-ghost w-full">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : null}

      {cameraError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {cameraError}
        </p>
      ) : null}

      <div className="card p-4">
        <p className="text-sm font-semibold text-mocha-800">
          What mood do you want to reach?
        </p>
        <p className="text-xs text-mocha-500">
          Choose the feeling you want your coffee to help you get to
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {targetMoods.map((m) => {
            const active = targetMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                className={`chip ${active ? "chip-active" : ""}`}
                onClick={() => setTargetMood((prev) => (prev === m.id ? "" : m.id))}
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