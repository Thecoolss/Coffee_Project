import { recommendCoffee } from "@/lib/recommendation";
import { analyzePhotoVibe } from "@/lib/vibe-analyzer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType, mode } = (await req.json()) as {
      imageBase64?: string;
      mimeType?: string;
      mode?: "mock" | "real";
    };

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const analysis = await analyzePhotoVibe(imageBase64, mimeType, mode);
    const recommendation = recommendCoffee(analysis.vibes, analysis.mood);

    return NextResponse.json({
      ...analysis,
      recommendation,
    });
  } catch (error) {
    console.error("[API /vibe] failed", error);

    return NextResponse.json(
      {
        vibes: ["cozy", "calm"],
        mood: "relaxed",
        energyLevel: "medium",
        summary: "Fallback vibe mode due to parsing issue.",
      },
      { status: 200 }
    );
  }
}