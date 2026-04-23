"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { BeanLogo } from "@/components/bean-logo";
import Link from "next/link";
import { ArrowLeft, Github, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <section className="space-y-5 pt-4">
      <Link href="/" className="inline-flex items-center gap-1 text-xs text-mocha-600">
        <ArrowLeft size={14} /> Home
      </Link>

      <div>
        <span className="pill pill-soft">
          <Info size={12} /> Settings
        </span>
        <h1 className="display mt-3 text-3xl font-semibold tracking-tight text-mocha-900">
          Preferences
        </h1>
        <p className="mt-1 text-sm text-mocha-600">
          Choose whether to use the demo or real AI engine. Demo is safest for presentations.
        </p>
      </div>

      <div className="card p-4">
        <ModeToggle />
        <p className="mt-3 text-xs text-mocha-500">
          Demo mode uses curated fallbacks. Gemini mode uses the real API when a key is present
          and quota is available.
        </p>
      </div>

      <div className="card flex items-center gap-3 p-4">
        <BeanLogo size={40} />
        <div>
          <p className="text-sm font-semibold text-mocha-900">Bean There</p>
          <p className="text-xs text-mocha-500">
            A Google hackathon project · built with Next.js, Tailwind, Gemini-ready.
          </p>
        </div>
      </div>

      <a
        href="https://ai.google.dev/"
        target="_blank"
        rel="noreferrer"
        className="card flex items-center justify-between p-4 text-sm text-mocha-700 transition hover:bg-white"
      >
        <span className="inline-flex items-center gap-2">
          <Github size={14} /> Powered by Google Gemini
        </span>
        <span className="text-mocha-500">→</span>
      </a>
    </section>
  );
}
