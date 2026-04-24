import { CafeResult } from "@/types";

type SearchInput = {
  lat: number;
  lng: number;
  radius?: number;
};

export async function findNearbyCafes(
  input: SearchInput
): Promise<CafeResult[]> {
  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const enabled = process.env.NEXT_PUBLIC_ENABLE_PLACES === "true";

  if (!enabled || !apiKey) {
    return [];
  }

  const radius = input.radius ?? 2500;

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.currentOpeningHours",
      },
      body: JSON.stringify({
        includedTypes: ["cafe", "coffee_shop"],
        maxResultCount: 8,
        rankPreference: "DISTANCE",
        locationRestriction: {
          circle: {
            center: {
              latitude: input.lat,
              longitude: input.lng,
            },
            radius,
          },
        },
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Places API failed:", response.status, errorText);
    return [];
  }

  const data = await response.json();
  const places = data?.places ?? [];

  return places.map((place: any) => {
    const latitude = place.location?.latitude;
    const longitude = place.location?.longitude;

    return {
      id: place.id,
      name: place.displayName?.text ?? "Unknown cafe",
      address: place.formattedAddress ?? "Address unavailable",
      rating: place.rating,
      reviewCount: place.userRatingCount,
      isOpenNow: place.currentOpeningHours?.openNow,
      location:
        typeof latitude === "number" && typeof longitude === "number"
          ? { latitude, longitude }
          : undefined,
      distanceMeters:
        typeof latitude === "number" && typeof longitude === "number"
          ? getDistanceMeters(
              input.lat,
              input.lng,
              latitude,
              longitude
            )
          : undefined,
    };
  });
}

function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadius = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadius * c);
}