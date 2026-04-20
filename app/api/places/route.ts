import { findNearbyCafes } from "@/lib/places";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lat, lng } = (await req.json()) as { lat?: number; lng?: number };
    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
    }

    const cafes = await findNearbyCafes({ lat, lng });
    return NextResponse.json({ cafes });
  } catch {
    return NextResponse.json({ cafes: [] }, { status: 200 });
  }
}
