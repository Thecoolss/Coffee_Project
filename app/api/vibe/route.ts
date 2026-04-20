import { analyzePhotoVibe } from "@/lib/vibe-analyzer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType, mode } = (await req.json()) as {
      imageBase64?: string;
      mimeType?: string;
      mode?: "mock" | "real";
    };
    console.log("[API /vibe] request", {
      hasImage: Boolean(imageBase64),
      mimeType,
      mode,
      imageLength: imageBase64?.length
    });
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const result = await analyzePhotoVibe(imageBase64, mimeType, mode);
    console.log("[API /vibe] result", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /vibe] failed", error);
    return NextResponse.json(
      { vibes: ["cozy", "calm"], summary: "Fallback vibe mode due to parsing issue." },
      { status: 200 }
    );
  }
}
