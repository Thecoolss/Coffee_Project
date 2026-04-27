"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ImagePlus, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveCoffeeMemory } from "@/lib/memory-storage";

type Cafe = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export default function AddMemoryPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coffeeName, setCoffeeName] = useState("");
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(next: File | null) {
    setFile(next);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);
  }

  async function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
  
        const maxWidth = 500;
        const scale = Math.min(1, maxWidth / image.width);
  
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
  
        const ctx = canvas.getContext("2d");
  
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Canvas not supported"));
          return;
        }
  
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
        const compressedImage = canvas.toDataURL("image/jpeg", 0.65);
  
        URL.revokeObjectURL(objectUrl);
        resolve(compressedImage);
      };
  
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Image could not load"));
      };
  
      image.src = objectUrl;
    });
  }

  async function detectCafeLocation() {
    if (!navigator.geolocation) {
      setError("Location is not supported on this browser.");
      return;
    }

    setLoadingLocation(true);
    setError(null);
    setCafes([]);
    setSelectedCafe(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const currentCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCoords(currentCoords);

          const res = await fetch("/api/places", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: currentCoords.lat,
              lng: currentCoords.lng,
              radius: 8000,
            }),
          });

          const data = await res.json();
          const nearbyCafes = data.cafes ?? [];

          setCafes(nearbyCafes);

          if (nearbyCafes.length > 0) {
            setSelectedCafe(nearbyCafes[0]);
          } else {
            setError("Location worked, but no nearby cafés were found.");
          }
        } catch {
          setError("Could not load nearby cafés.");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setError("Please allow location access and try again.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  async function handleSave() {
    if (!file) return setError("Upload a photo first.");
    if (!coffeeName.trim()) return setError("Enter coffee name.");
    if (!coords) return setError("Please detect your café/location first.");

    setSaving(true);
    setError(null);

    try {
      const imageUrl = await toBase64(file);

      saveCoffeeMemory({
        id: crypto.randomUUID(),
        imageUrl,
        coffeeName,
        cafeName: selectedCafe?.name,
        address: selectedCafe?.address,
        city: selectedCafe?.address?.split(",").slice(-2, -1)[0]?.trim(),
        lat: selectedCafe?.location?.latitude ?? coords.lat,
        lng: selectedCafe?.location?.longitude ?? coords.lng,
        createdAt: new Date().toISOString(),
      });

      router.push("/globe");
    } catch {
      setError("Could not save memory. Try a smaller photo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5 pt-4">
      <Link href="/" className="text-sm text-mocha-600 hover:text-mocha-900">
        ← Back home
      </Link>

      <div>
        <span className="pill pill-soft">
          <Sparkles size={12} /> Coffee Memory
        </span>

        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Add your coffee moment
        </h1>

        <p className="mt-1 text-sm text-mocha-600">
          Capture where you were and what you drank.
        </p>
      </div>

      <label
        htmlFor="memory-upload"
        className="card relative block cursor-pointer overflow-hidden p-0"
      >
        {previewUrl ? (
          <div className="relative h-56 w-full">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-mocha-900/60 to-transparent p-3 text-xs text-cream-50">
              Tap to change photo
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,199,125,0.35)] text-mocha-700">
              <ImagePlus size={24} />
            </div>
            <p className="text-sm font-semibold text-mocha-800">Tap to upload photo</p>
            <p className="text-xs text-mocha-500">Your coffee, café, or moment</p>
          </div>
        )}

        <input
          id="memory-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label htmlFor="memory-upload" className="btn btn-ghost w-full cursor-pointer justify-center">
          Upload photo
        </label>

        <label className="btn btn-primary w-full cursor-pointer justify-center">
          <Camera size={16} /> Take photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
        </label>
      </div>

      <div className="card p-4">
        <p className="text-sm font-semibold text-mocha-800">What did you drink?</p>
        <p className="text-xs text-mocha-500">Add the coffee name so you remember it later</p>

        <input
          value={coffeeName}
          onChange={(e) => setCoffeeName(e.target.value)}
          placeholder="e.g. Cappuccino"
          className="mt-3 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm"
        />
      </div>

      <button onClick={detectCafeLocation} disabled={loadingLocation} className="btn btn-ghost w-full">
        <MapPin size={16} />
        {loadingLocation ? "Finding nearby cafés..." : "Detect café/location"}
      </button>

      {cafes.length > 0 ? (
        <div className="card space-y-2 p-4">
          <p className="text-sm font-semibold text-mocha-800">Choose the café</p>

          {cafes.map((cafe) => (
            <button
              key={cafe.id}
              onClick={() => setSelectedCafe(cafe)}
              className={`w-full rounded-xl border p-3 text-left text-sm ${
                selectedCafe?.id === cafe.id
                  ? "border-mocha-700 bg-[rgba(232,199,125,0.25)]"
                  : "border-[var(--line)] bg-white"
              }`}
            >
              <p className="font-semibold text-mocha-900">{cafe.name}</p>
              <p className="text-xs text-mocha-500">{cafe.address}</p>
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button onClick={handleSave} disabled={saving || !file} className="btn btn-primary w-full">
        {saving ? "Saving..." : "Save to map"}
      </button>
    </section>
  );
}