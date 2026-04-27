import { CoffeeMap } from "../../components/coffee-map";

export default function GlobePage() {
  return (
    <main className="h-screen overflow-hidden bg-[#120b07] px-4 py-8 text-white">
        <div className="mx-auto max-w-md space-y-6 h-full overflow-hidden">
        <a href="/" className="text-sm text-white/70">
          ← Back home
        </a>

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300">
            Coffee Passport
          </p>
          <h1 className="mt-2 text-4xl font-bold">Your Coffee Map</h1>
          <p className="mt-2 text-sm text-white/70">
            See every city where you’ve had coffee.
          </p>
        </div>

        <CoffeeMap />
      </div>
    </main>
  );
}