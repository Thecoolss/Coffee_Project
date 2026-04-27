"use client";

import { useEffect, useRef, useState } from "react";
import { CoffeeMemory } from "@/types";
import {
  deleteCoffeeMemory,
  getCoffeeMemories,
} from "../lib/memory-storage";
import type L from "leaflet";

export function CoffeeMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityMemories, setCityMemories] = useState<CoffeeMemory[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      if (!mapRef.current) return;

      const leaflet = await import("leaflet");

      if (cancelled || !mapRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      mapRef.current.innerHTML = "";

      if ((mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id;
      }

      const map = leaflet.map(mapRef.current, {
        zoomControl: false,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
      });

      leafletMapRef.current = map;

      leaflet
        .tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "&copy; OpenStreetMap &copy; CARTO",
          }
        )
        .addTo(map);

      const memories = getCoffeeMemories().filter(
        (memory) =>
          typeof memory.lat === "number" && typeof memory.lng === "number"
      );

      if (memories.length === 0) {
        map.setView([40.4168, -3.7038], 3);
      } else {
        const grouped = memories.reduce((acc, memory) => {
          const city = memory.city || memory.address || "Unknown place";
          if (!acc[city]) acc[city] = [];
          acc[city].push(memory);
          return acc;
        }, {} as Record<string, CoffeeMemory[]>);

        Object.entries(grouped).forEach(([city, items]) => {
          const first = items[0];

          const icon = leaflet.divIcon({
            className: "",
            html: `
              <div style="
                width: 78px;
                height: 78px;
                border-radius: 20px;
                border: 4px solid white;
                overflow: hidden;
                box-shadow: 0 12px 30px rgba(0,0,0,0.35);
                background: #2b160c;
                position: relative;
              ">
                <img src="${first.imageUrl}" style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                " />
                <div style="
                  position: absolute;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: linear-gradient(transparent, rgba(0,0,0,0.85));
                  color: white;
                  font-size: 14px;
                  font-weight: 700;
                  padding: 18px 6px 5px;
                ">
                  ${items.length}
                </div>
              </div>
            `,
            iconSize: [78, 78],
            iconAnchor: [39, 78],
          });

          const marker = leaflet
            .marker([first.lat!, first.lng!], { icon })
            .addTo(map);

          marker.on("click", () => {
            map.flyTo([first.lat!, first.lng!], 15, { duration: 0.8 });
            setSelectedCity(city);
            setCityMemories(items);
          });
        });

        const bounds = leaflet.latLngBounds(
          memories.map(
            (memory) => [memory.lat!, memory.lng!] as [number, number]
          )
        );

        map.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 15,
        });
      }

      setTimeout(() => {
        if (!cancelled) map.invalidateSize();
      }, 250);
    }

    loadMap();

    return () => {
      cancelled = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, [refreshKey]);

  function handleDeleteMemory(id: string) {
    deleteCoffeeMemory(id);

    const updated = getCoffeeMemories();
    const updatedCityMemories = selectedCity
      ? updated.filter(
          (memory) =>
            (memory.city || memory.address || "Unknown place") === selectedCity
        )
      : [];

    setCityMemories(updatedCityMemories);

    if (updatedCityMemories.length === 0) {
      setSelectedCity(null);
    }

    setRefreshKey((key) => key + 1);
  }

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-[2rem] bg-[#120b07] shadow-xl">
      <div
        ref={mapRef}
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
        style={{ pointerEvents: "auto", touchAction: "none" }}
      />

      <div className="pointer-events-none absolute left-4 top-4 z-[999] rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white backdrop-blur">
        Coffee Map
      </div>

      {selectedCity ? (
        <div className="absolute bottom-0 left-0 right-0 z-[999] max-h-72 overflow-y-auto rounded-t-[2rem] bg-[#160d08]/95 p-4 text-white shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300">
                City memories
              </p>
              <h3 className="text-xl font-bold">{selectedCity}</h3>
            </div>

            <button
              onClick={() => {
                setSelectedCity(null);
                setCityMemories([]);
              }}
              className="rounded-full bg-white/10 px-3 py-1 text-sm"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {cityMemories.map((memory) => (
              <div
                key={memory.id}
                className="relative overflow-hidden rounded-2xl bg-white/10"
              >
                <img
                  src={memory.imageUrl}
                  alt={memory.coffeeName}
                  className="h-28 w-full object-cover"
                />

                <button
                  onClick={() => handleDeleteMemory(memory.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                >
                  ✕
                </button>

                <div className="p-3">
                  <p className="font-semibold">{memory.coffeeName}</p>
                  <p className="text-xs text-white/60">
                    {memory.cafeName || "Unknown café"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}