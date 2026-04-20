"use client";

import Link from "next/link";
import { Compass, MessageCircle, Stamp, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/passport", label: "Passport", icon: Stamp },
  { href: "/nearby", label: "Nearby", icon: Compass },
  { href: "/chat", label: "Chat", icon: MessageCircle }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="absolute bottom-0 left-0 right-0 z-20 border-t border-[var(--line)] bg-[rgba(253,249,243,0.92)] backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[calc(env(safe-area-inset-bottom,0)+0.35rem)] pt-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="group relative flex flex-col items-center gap-1 py-1.5 text-[11px] font-medium"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                  active
                    ? "bg-mocha-700 text-cream-50 shadow-[0_8px_18px_-10px_rgba(77,38,21,0.7)]"
                    : "text-mocha-600 group-hover:bg-mocha-700/5"
                }`}
              >
                <Icon size={17} strokeWidth={active ? 2.4 : 2} />
              </span>
              <span className={active ? "text-mocha-700" : "text-mocha-600/70"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
