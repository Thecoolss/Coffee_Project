import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { PhoneFrame } from "@/components/phone-frame";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Bean There",
  description: "A playful AI-powered cultural coffee passport",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PhoneFrame>
          <div className="app-shell">
            <main className="app-main">
              <div className="mx-auto max-w-md px-5 pt-6">{children}</div>
            </main>
            <BottomNav />
          </div>
        </PhoneFrame>
      </body>
    </html>
  );
}
