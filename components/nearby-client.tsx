"use client";

import { CafeResult } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Star, Compass, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "empty" | "error";

export function NearbyClient() {
  const [cafes, setCafes] = useState<CafeResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("Use your location to find cafe vibes nearby.");

  function fetchCafes(lat: number, lng: number) {
    setStatus("loading");
    setMessage("Finding cafes nearby…");
    fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng })
    })
      .then((r) => r.json())
      .then((d: { cafes: CafeResult[] }) => {
        setCafes(d.cafes);
        if (d.cafes.length === 0) {
          setStatus("empty");
          setMessage("Places isn't configured yet, or no cafes were found nearby.");
        } else {
          setStatus("success");
          setMessage("Try this coffee vibe near you.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Could not fetch cafes. Please try again.");
      });
  }

  return (
    <section className="space-y-5 pt-4">
      <div>
        <span className="pill pill-soft">
          <Compass size={12} /> Nearby
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Cafes around you
        </h1>
        <p className="mt-1 text-sm text-mocha-600">{message}</p>
      </div>

      <button
        className="btn btn-primary w-full"
        onClick={() => {
          if (!navigator.geolocation) {
            setStatus("error");
            setMessage("Geolocation is not available in this browser.");
            return;
          }
          setStatus("loading");
          setMessage("Getting your location…");
          navigator.geolocation.getCurrentPosition(
            (pos) => fetchCafes(pos.coords.latitude, pos.coords.longitude),
            () => {
              setStatus("error");
              setMessage("Location permission denied.");
            }
          );
        }}
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Searching…
          </>
        ) : (
          <>
            <MapPin size={16} /> Use my current location
          </>
        )}
      </button>

      {status === "loading" ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card flex gap-3 p-3">
              <div className="skeleton h-16 w-16" />
              <div className="flex-1 space-y-2 py-1">
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {status === "success" || status === "empty" ? (
        <div className="space-y-3">
          {cafes.map((cafe) => (
            <article key={cafe.id} className="card p-3">
              <div className="flex gap-3">
                {cafe.photoUrl ? (
                  <Image
                    src={cafe.photoUrl}
                    alt={cafe.name}
                    width={68}
                    height={68}
                    className="h-[68px] w-[68px] rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-[68px] w-[68px] flex-none items-center justify-center rounded-xl bg-[rgba(232,199,125,0.35)] text-2xl">
                    ☕
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[15px] font-semibold text-mocha-900">
                    {cafe.name}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-xs text-mocha-500">{cafe.address}</p>
                  {typeof cafe.rating === "number" ? (
                    <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-mocha-700">
                      <Star size={12} className="fill-[#d4a574] stroke-[#b5691a]" />
                      {cafe.rating.toFixed(1)}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {status === "empty" ? (
            <EmptyState />
          ) : null}
        </div>
      ) : null}

      {status === "idle" ? <EmptyState initial /> : null}
    </section>
  );
}

function EmptyState({ initial = false }: { initial?: boolean }) {
  return (
    <div className="card flex flex-col items-center py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(232,199,125,0.35)] text-xl">
        ☕
      </div>
      <p className="mt-3 text-sm font-semibold text-mocha-800">
        {initial ? "No cafes yet" : "No results right now"}
      </p>
      <p className="mt-1 max-w-[24ch] text-xs text-mocha-500">
        Tap the button above to pull nearby cafes. Works best with the Places API configured.
      </p>
    </div>
  );
}
