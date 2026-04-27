"use client";

import { useEffect, useState } from "react";
import { CoffeeMemory } from "@/types";
import {
  deleteCoffeeMemory,
  getCoffeeMemories,
  saveCoffeeMemory,
} from "../lib/memory-storage";

type Cafe = {
  id: string;
  name: string;
  address: string;
  rating?: number;
};

function extractCityFromAddress(address?: string) {
  if (!address) return undefined;

  const parts = address.split(",").map((part) => part.trim());

  for (const part of parts) {
    const withoutPostalCode = part.replace(/^\d{4,6}\s*/, "").trim();

    if (
      withoutPostalCode &&
      !withoutPostalCode.toLowerCase().includes("spain") &&
      !withoutPostalCode.toLowerCase().includes("españa")
    ) {
      return withoutPostalCode;
    }
  }

  return undefined;
}

async function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
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

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.65);

      URL.revokeObjectURL(objectUrl);
      resolve(compressedDataUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image could not load"));
    };

    image.src = objectUrl;
  });
}

export function CoffeeMemoryJournal() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [coffeeName, setCoffeeName] = useState("");
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [memories, setMemories] = useState<CoffeeMemory[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    setMemories(getCoffeeMemories());
  }, []);

  function handlePhoto(file: File | null) {
    setFile(file);
    setSelectedCafe(null);
    setCafes([]);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  }

  async function findLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported on this browser.");
      return;
    }

    setLoadingLocation(true);
    setLocationMessage("");
    setCafes([]);
    setSelectedCafe(null);
    setCurrentCoords(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentCoords(coords);
          setLocationMessage("Location found. Searching nearby cafés...");

          const res = await fetch("/api/places", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: coords.lat,
              lng: coords.lng,
              radius: 5000,
            }),
          });

          if (!res.ok) {
            throw new Error("Places request failed");
          }

          const data = await res.json();
          const nearbyCafes = data.cafes ?? [];

          setCafes(nearbyCafes);

          if (nearbyCafes.length > 0) {
            setSelectedCafe(nearbyCafes[0]);
            setLocationMessage("Choose the café you visited.");
          } else {
            setLocationMessage(
              "Location worked, but no nearby cafés were found."
            );
          }
        } catch {
          setLocationMessage(
            "Location worked, but cafés could not be loaded. Check your Places API key."
          );
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        if (error.code === 1) {
          setLocationMessage(
            "Location is blocked. Please allow location access for localhost in Arc."
          );
        } else if (error.code === 2) {
          setLocationMessage(
            "Your location could not be detected. Try Wi-Fi or restart Arc."
          );
        } else if (error.code === 3) {
          setLocationMessage("Location request timed out. Please try again.");
        } else {
          setLocationMessage("Could not access your location.");
        }

        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  async function handleSaveMemory() {
    if (!file) {
      alert("Please upload a coffee photo or selfie.");
      return;
    }

    if (!coffeeName.trim()) {
      alert("Please enter the coffee you had.");
      return;
    }

    try {
      const imageUrl = await fileToDataUrl(file);

      const memory: CoffeeMemory = {
        id: crypto.randomUUID(),
        imageUrl,
        coffeeName,
        cafeName: selectedCafe?.name,
        address: selectedCafe?.address,
        city: extractCityFromAddress(selectedCafe?.address),
        lat: currentCoords?.lat,
        lng: currentCoords?.lng,
        createdAt: new Date().toISOString(),
      };

      saveCoffeeMemory(memory);

      const updated = getCoffeeMemories();
      setMemories(updated);

      setFile(null);
      setPreview("");
      setCoffeeName("");
      setSelectedCafe(null);
      setCafes([]);
      setLocationMessage("");
      setCurrentCoords(null);
    } catch {
      alert("Could not save memory. Try using a smaller photo.");
    }
  }

  function handleDelete(id: string) {
    deleteCoffeeMemory(id);
    setMemories(getCoffeeMemories());
  }

  return (
    <section className="mx-auto w-full max-w-md space-y-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">Coffee Memory Journal</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Save where you had coffee, what you drank, and the memory behind it.
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
        className="block w-full text-sm"
      />

      {preview ? (
        <img
          src={preview}
          alt="Coffee memory preview"
          className="h-64 w-full rounded-2xl object-cover"
        />
      ) : null}

      <input
        value={coffeeName}
        onChange={(e) => setCoffeeName(e.target.value)}
        placeholder="What coffee did you have? e.g. Iced latte"
        className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm"
      />

      <button
        onClick={findLocation}
        disabled={loadingLocation}
        className="w-full rounded-2xl border border-neutral-300 px-4 py-3"
      >
        {loadingLocation ? "Finding nearby cafés..." : "Detect my café/location"}
      </button>

      {locationMessage ? (
        <p className="rounded-xl bg-neutral-100 p-3 text-sm text-neutral-700">
          {locationMessage}
        </p>
      ) : null}

      {cafes.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium">Choose the café:</p>

          {cafes.map((cafe) => (
            <button
              key={cafe.id}
              onClick={() => setSelectedCafe(cafe)}
              className={`w-full rounded-xl border p-3 text-left text-sm ${
                selectedCafe?.id === cafe.id
                  ? "border-black bg-neutral-100"
                  : "border-neutral-200"
              }`}
            >
              <p className="font-medium">{cafe.name}</p>
              <p className="text-neutral-600">{cafe.address}</p>
            </button>
          ))}
        </div>
      ) : null}

      <button
        onClick={handleSaveMemory}
        className="w-full rounded-2xl bg-black px-4 py-3 text-white"
      >
        Save coffee memory
      </button>

      {memories.length > 0 ? (
        <div className="space-y-3 pt-4">
          <h3 className="font-semibold">Your saved memories</h3>

          {memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-2xl border border-neutral-200 p-3"
            >
              <img
                src={memory.imageUrl}
                alt={memory.coffeeName}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />

              <p className="font-semibold">{memory.coffeeName}</p>

              {memory.cafeName ? (
                <p className="text-sm text-neutral-600">{memory.cafeName}</p>
              ) : null}

              {memory.city ? (
                <p className="text-xs text-neutral-500">{memory.city}</p>
              ) : null}

              {memory.address ? (
                <p className="text-xs text-neutral-500">{memory.address}</p>
              ) : null}

              <p className="mt-1 text-xs text-neutral-400">
                {new Date(memory.createdAt).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleDelete(memory.id)}
                className="mt-2 text-xs text-red-500"
              >
                Delete memory
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}