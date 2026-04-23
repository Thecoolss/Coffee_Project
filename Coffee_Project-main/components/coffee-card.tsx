import { Coffee } from "@/types";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

type Props = {
  coffee: Coffee;
  reason?: string;
  featured?: boolean;
};

export function CoffeeCard({ coffee, reason, featured }: Props) {
  if (featured) {
    return (
      <article className="card-elevated relative overflow-hidden p-6 animate-pop">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-50 blur-2xl"
          style={{ background: "radial-gradient(circle, #e8c77d 0%, transparent 70%)" }}
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="pill pill-soft">
              {coffee.originCountry} · {coffee.region}
            </span>
            <h2 className="display mt-3 text-[28px] leading-tight font-semibold text-mocha-900">
              {coffee.name}
            </h2>
            <p className="mt-1 text-sm capitalize text-mocha-600">
              {coffee.roastLevel} roast · {coffee.brewMethod}
            </p>
          </div>
          <div className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-white text-3xl shadow-[0_10px_24px_-12px_rgba(77,38,21,0.35)]">
            {coffee.stampIcon}
          </div>
        </div>

        <p className="relative mt-4 text-[15px] leading-relaxed text-mocha-800/90">
          &ldquo;{coffee.storySnippet}&rdquo;
        </p>

        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {coffee.flavorNotes.map((note) => (
            <span key={note} className="chip">
              {note}
            </span>
          ))}
        </div>

        {reason ? (
          <p className="relative mt-4 rounded-xl border border-[rgba(181,105,26,0.25)] bg-[rgba(232,199,125,0.22)] px-3 py-2 text-xs font-medium text-mocha-700">
            {reason}
          </p>
        ) : null}

        <div className="relative mt-5 flex gap-2">
          <Link href={`/coffee/${coffee.id}`} className="btn btn-ghost flex-1">
            Details <ArrowRight size={16} />
          </Link>
          <Link href={`/chat/${coffee.id}`} className="btn btn-primary flex-1">
            <MessageCircle size={16} /> Talk
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-mocha-500">
            {coffee.originCountry} · {coffee.region}
          </p>
          <h2 className="display mt-1 text-lg font-semibold text-mocha-900">{coffee.name}</h2>
          <p className="text-xs capitalize text-mocha-600">{coffee.roastLevel} roast</p>
        </div>
        <span className="text-3xl">{coffee.stampIcon}</span>
      </div>
      <p className="mt-2 text-sm text-mocha-800/80">{coffee.flavorNotes.slice(0, 3).join(" · ")}</p>
    </article>
  );
}
