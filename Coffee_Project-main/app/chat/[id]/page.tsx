import { ChatClient } from "@/components/chat-client";
import { coffeeById } from "@/data/coffees";
import { notFound } from "next/navigation";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coffee = coffeeById[id];
  if (!coffee) return notFound();
  return <ChatClient coffee={coffee} />;
}
