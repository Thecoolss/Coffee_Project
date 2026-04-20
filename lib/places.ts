import { CafeResult } from "@/types";

type SearchInput = {
  lat: number;
  lng: number;
  radius?: number;
};

export async function findNearbyCafes(input: SearchInput): Promise<CafeResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const enabled = process.env.NEXT_PUBLIC_ENABLE_PLACES === "true";

  if (!enabled || !apiKey) {
    return [];
  }

  const radius = input.radius ?? 2500;
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    `location=${input.lat},${input.lng}&radius=${radius}&type=cafe&key=${apiKey}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const results = (data?.results ?? []).slice(0, 8);

  return results.map((place: any) => ({
    id: place.place_id,
    name: place.name,
    address: place.vicinity ?? "Address unavailable",
    rating: place.rating,
    photoUrl: place.photos?.[0]?.photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
      : undefined
  }));
}
