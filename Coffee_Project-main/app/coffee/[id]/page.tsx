import { coffeeById } from "@/data/coffees";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Coffee as CoffeeIcon, MessageCircle, Sparkles } from "lucide-react";

export default async function CoffeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coffee = coffeeById[id];
  if (!coffee) return notFound();

  return (
    <section className="space-y-5 pt-4">
      <Link href="/passport" className="inline-flex items-center gap-1 text-xs text-mocha-600">
        <ArrowLeft size={14} /> Back
      </Link>

      <div
        className="relative overflow-hidden rounded-[2rem] p-6 text-cream-50"
        style={{
          background:
            "radial-gradient(90% 80% at 100% 0%, rgba(232,199,125,0.45) 0%, rgba(232,199,125,0) 60%), linear-gradient(160deg, #4d2615 0%, #30170d 100%)"
        }}
      >
        <span className="pill bg-cream-50/15 text-gold">
          {coffee.originCountry} · {coffee.region}
        </span>
        <h1 className="display mt-3 text-[34px] font-bold leading-tight">{coffee.name}</h1>
        <p className="mt-1 text-sm capitalize text-cream-50/70">
          {coffee.roastLevel} roast · {coffee.brewMethod}
        </p>
        <div className="pointer-events-none absolute -right-4 -top-4 text-7xl opacity-90 drop-shadow-lg">
          {coffee.stampIcon}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-mocha-600" />
          <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">Story</p>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-mocha-800/90">
          &ldquo;{coffee.storySnippet}&rdquo;
        </p>
      </div>

      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">
          Flavor notes
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {coffee.flavorNotes.map((n) => (
            <span key={n} className="chip">
              {n}
            </span>
          ))}
        </div>
        <div className="divider my-4" />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-mocha-500">Brew</p>
            <p className="mt-1 font-semibold capitalize text-mocha-800">{coffee.brewMethod}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-mocha-500">Roast</p>
            <p className="mt-1 font-semibold capitalize text-mocha-800">{coffee.roastLevel}</p>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2">
          <CoffeeIcon size={15} className="text-mocha-600" />
          <p className="text-xs font-semibold uppercase tracking-wider text-mocha-500">
            Coffee personality
          </p>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {coffee.personalityTraits.map((p) => (
            <span key={p} className="chip">
              {p}
            </span>
          ))}
        </div>
      </div>

      <Link href={`/chat/${coffee.id}`} className="btn btn-primary w-full">
        <MessageCircle size={18} /> Chat with {coffee.name}
      </Link>
    </section>
  );
}
