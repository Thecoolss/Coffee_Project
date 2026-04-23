import { SelfieVibeFlow } from "@/components/selfie-vibe-flow";
import Link from "next/link";
import { coffees } from "@/data/coffees";
import { ArrowRight, Camera, Settings, Sparkles } from "lucide-react";
import { BeanLogo } from "@/components/bean-logo";

export default function HomePage() {
  const countries = new Set(coffees.map((c) => c.originCountry)).size;

  return (
    <section className="space-y-6 pt-4 md:pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BeanLogo size={32} />
          <span className="display text-lg font-semibold tracking-tight text-mocha-900">
            Bean There
          </span>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white/70 text-mocha-700 transition hover:bg-white"
        >
          <Settings size={16} />
        </Link>
      </div>

      <header
        className="relative overflow-hidden rounded-[2rem] p-6 text-cream-50 shadow-[0_40px_80px_-30px_rgba(77,38,21,0.7)]"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, rgba(232,199,125,0.55) 0%, rgba(232,199,125,0) 60%), linear-gradient(160deg, #4d2615 0%, #30170d 100%)"
        }}
      >
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-gold/80">
          <Sparkles size={14} />
          <span>Google Hackathon</span>
        </div>
        <h1 className="display mt-4 text-[44px] leading-[1.02] font-bold tracking-tight">
          Bean<br />There.
        </h1>
        <p className="mt-3 max-w-[22ch] text-sm text-cream-50/80">
          Your playful passport through the world&rsquo;s coffees &mdash; matched to your vibe.
        </p>

        <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-90">
          <BeanLogo size={160} />
        </div>
      </header>

      <SelfieVibeFlow />
      <div className="grid gap-3">
        <Link href="/analyze" className="btn btn-primary w-full">
          <Camera size={18} /> Start your journey <ArrowRight size={16} />
        </Link>
        <Link href="/recommendation?demo=1" className="btn btn-ghost w-full">
          Peek a demo match
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Origins" value={countries.toString()} />
        <StatCard label="Coffees" value={coffees.length.toString()} />
        <StatCard label="Stamps" value="∞" />
      </div>

      <div className="card p-5">
        <h2 className="display text-xl font-semibold text-mocha-900">How it works</h2>
        <ol className="mt-3 space-y-2 text-sm text-mocha-800/90">
          <Step n={1} text="Upload a photo or pick a mood" />
          <Step n={2} text="Get your coffee vibe match" />
          <Step n={3} text="Unlock a stamp & chat with your bean" />
        </ol>
        <p className="mt-4 rounded-xl bg-[rgba(232,199,125,0.25)] px-3 py-2 text-[11px] text-mocha-700">
          This is a playful style matcher &mdash; not identity inference.
        </p>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card flex flex-col items-center justify-center py-4 text-center">
      <p className="display text-2xl font-semibold text-mocha-900">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-mocha-500">{label}</p>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-mocha-700 text-[11px] font-bold text-gold">
        {n}
      </span>
      <span className="pt-0.5">{text}</span>
    </li>
  );
}
