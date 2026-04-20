import { coffeeById } from "@/data/coffees";
import { chatWithCoffee } from "@/lib/coffee-chat";
import { ChatMessage } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      coffeeId?: string;
      messages?: ChatMessage[];
      mode?: "mock" | "real";
    };
    console.log("[API /chat] request", {
      coffeeId: body.coffeeId,
      mode: body.mode,
      messageCount: body.messages?.length
    });
    if (!body.coffeeId || !body.messages) {
      return NextResponse.json({ error: "Missing coffeeId or messages" }, { status: 400 });
    }

    const coffee = coffeeById[body.coffeeId];
    if (!coffee) {
      return NextResponse.json({ error: "Invalid coffee" }, { status: 404 });
    }

    const response = await chatWithCoffee(coffee, body.messages, body.mode);
    console.log("[API /chat] response", {
      coffeeId: body.coffeeId,
      preview: response.slice(0, 180)
    });
    return NextResponse.json({ response });
  } catch (error) {
    console.error("[API /chat] failed", error);
    return NextResponse.json(
      { response: "I am still brewing my response. Try again in a moment." },
      { status: 200 }
    );
  }
}
