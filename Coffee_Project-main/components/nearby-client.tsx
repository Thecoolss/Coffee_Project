"use client";

import { useState } from "react";
import { CafeResult } from "@/types";

type Cafe = CafeResult;

export function NearbyClient({ coffeeName }: { coffeeName?: string }) {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleUseLocation() {
    if (!navigator.geolocation) return;

    setLoading(true);

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
          setCafes([]);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  }

  return (
    <section className="space-y-5 pt-4">
      <div>
        <h1 className="display text-3xl font-semibold tracking-tight text-mocha-900">
          Nearby
        </h1>
        <p className="mt-1 text-sm text-mocha-600">
        {coffeeName
        ? `Nearby cafes likely to serve ${coffeeName}.`
        : "Nearby cafes for your coffee recommendation."}
        </p>
      </div>

      <button onClick={handleUseLocation} className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Finding cafes..." : "Use my current location"}
      </button>

            <div className="space-y-3">
        {cafes.map((cafe) => (
            <div key={cafe.id} className="card p-4">
            <div className="flex items-start gap-3">
                <span className="text-xl">☕</span>
                <div>
                <p className="font-semibold text-mocha-900">{cafe.name}</p>
                <p className="text-sm text-mocha-600">{cafe.address}</p>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-mocha-500">
                    {typeof cafe.rating === "number" ? (
                    <span className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{cafe.rating}</span>
                        {typeof cafe.reviewCount === "number" ? (
                        <span className="text-mocha-400">({cafe.reviewCount})</span>
                        ) : null}
                    </span>
                    ) : null}

                    {typeof cafe.distanceMeters === "number" ? (
                    <span>
                        {cafe.distanceMeters < 1000
                        ? `${cafe.distanceMeters} m away`
                        : `${(cafe.distanceMeters / 1000).toFixed(1)} km away`}
                    </span>
                    ) : null}

                    {typeof cafe.isOpenNow === "boolean" ? (
                    <span
                        className={
                        cafe.isOpenNow
                            ? "font-medium text-green-700"
                            : "font-medium text-red-600"
                        }
                    >
                        {cafe.isOpenNow ? "Open now" : "Closed"}
                    </span>
                    ) : null}
                </div>

                {/* 🔥 GOOGLE MAPS BUTTON */}
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    cafe.name
                    )}&query_place_id=${cafe.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-mocha-900 px-3 py-2 text-sm text-white transition hover:bg-mocha-800"
                >
                    📍 Open in Maps
                </a>
                </div>
            </div>
            </div>
        ))}
        </div>
    </section>
  );
}