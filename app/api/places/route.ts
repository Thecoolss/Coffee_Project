import { findNearbyCafes } from "@/lib/places";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lat, lng, radius } = (await req.json()) as {
      lat?: number;
      lng?: number;
      radius?: number;
    };

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "lat/lng required" },
        { status: 400 }
      );
    }

    const cafes = await findNearbyCafes({
      lat,
      lng,
      radius: radius ?? 5000, // 🔥 bigger search radius
    });

    return NextResponse.json({ cafes });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ cafes: [] }, { status: 200 });
  }
}