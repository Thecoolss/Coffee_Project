"use client";

import { useMemo, useState } from "react";

type ApiVibeResponse = {
  vibes: string[];
  mood: string;
  energyLevel: "low" | "medium" | "high";
  summary: string;
  recommendation?: {
    primary: {
      id: string;
      name: string;
      originCountry: string;
      brewMethod: string;
      roastLevel: string;
      flavorNotes: string[];
    };
    alternates: {
      id: string;
      name: string;
    }[];
    reason: string;
    matchedTags: string[];
  };
};

type Cafe = {
  id: string;
  name: string;
  address: string;
  rating?: number;
};

export function SelfieVibeFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiVibeResponse | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);

  const canAnalyze = useMemo(() => !!file, [file]);

  async function toBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const full = String(reader.result);
        const base64 = full.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const imageBase64 = await toBase64(file);

      const res = await fetch("/api/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type || "image/jpeg",
          mode: "real",
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFindCafes() {
    if (!navigator.geolocation) return;

    setPlacesLoading(true);
    setCafes([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("/api/places", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: 2500,
            }),
          });

          const data = await res.json();
          setCafes(data.cafes ?? []);
        } catch (error) {
          console.error(error);
        } finally {
          setPlacesLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setPlacesLoading(false);
      }
    );
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Take a selfie, get your coffee match</h2>
        <p className="mt-1 text-sm text-neutral-600">
          We estimate your current vibe from a selfie and suggest a coffee that fits.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={(e) => {
          const picked = e.target.files?.[0] ?? null;
          setFile(picked);
          setResult(null);
          setCafes([]);
          if (picked) {
            setPreview(URL.createObjectURL(picked));
          } else {
            setPreview("");
          }
        }}
        className="block w-full text-sm"
      />

      {preview ? (
        <img
          src={preview}
          alt="Selfie preview"
          className="h-64 w-full rounded-2xl object-cover"
        />
      ) : null}

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || loading}
        className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze my vibe"}
      </button>

      {result ? (
        <div className="space-y-3 rounded-2xl bg-neutral-50 p-4">
          <div>
            <p className="text-sm text-neutral-500">Detected mood</p>
            <p className="text-lg font-semibold capitalize">{result.mood}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Vibes</p>
            <p className="capitalize">{result.vibes.join(", ")}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Suggested coffee</p>
            <p className="text-lg font-semibold">
              {result.recommendation?.primary.name}
            </p>
            <p className="text-sm text-neutral-600">{result.summary}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Why this match</p>
            <p className="text-sm text-neutral-700">
              {result.recommendation?.reason}
            </p>
          </div>

          <button
            onClick={handleFindCafes}
            disabled={placesLoading}
            className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
          >
            {placesLoading ? "Finding nearby cafes..." : "Find nearby cafes"}
          </button>

          {cafes.length > 0 ? (
            <div className="space-y-2">
              {cafes.map((cafe) => (
                <div key={cafe.id} className="rounded-xl border border-neutral-200 p-3">
                  <p className="font-medium">{cafe.name}</p>
                  <p className="text-sm text-neutral-600">{cafe.address}</p>
                  {cafe.rating ? (
                    <p className="text-sm text-neutral-500">⭐ {cafe.rating}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}