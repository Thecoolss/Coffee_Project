# Bean There

Bean There is a mobile-first web app that turns a selfie into a playful coffee journey:

- analyzes photo vibe (with safe fallbacks)
- recommends a coffee bean profile and a practical drink order
- unlocks passport stamps and visa-style badges
- lets users chat with the matched coffee personality

Built for hackathon demos: fast, polished, and resilient even when external APIs fail.

## Judge-Friendly Overview

- **Problem:** Coffee discovery is generic and not emotionally engaging.
- **Solution:** A "coffee passport" that maps vibe -> bean -> drink -> conversation.
- **Creativity:** Animated talking bean avatar, country-themed visuals, passport progression.
- **Practicality:** Users still get a useful order recommendation and nearby cafe links.
- **Reliability:** Demo mode works without paid APIs; real mode upgrades with Gemini/Places.

## Repository Layout

The app is now at the repository root (`app`, `components`, `lib`, `data`, `public`, etc.).

## Core Features

- Photo input with two paths: upload from gallery or capture from webcam/camera
- AI vibe analysis (`Gemini`) with deterministic fallback (`Demo`)
- Coffee recommendation + "why from your photo" explanation
- Drink recommendation ("best order for this vibe")
- Chat with coffee personas
- Passport booklet UI with stamps, date marks, and visa stickers
- Nearby cafes tab (separate from recommendation flow)
- Mobile-first UI with desktop phone frame for presentation

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- `motion` for page and character animation
- Local curated coffee and drink datasets
- Optional Gemini + Google Places integration

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_AI_MODE=real
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash

NEXT_PUBLIC_ENABLE_PLACES=true
GOOGLE_PLACES_API_KEY=...
```

Notes:

- Use `NEXT_PUBLIC_AI_MODE=mock` for guaranteed offline-safe demos.
- Nearby cafes require Places to be enabled and a valid key.

## API Endpoints

- `POST /api/vibe`
  - Input: `{ imageBase64, mimeType?, mode? }`
  - Output: vibe analysis + recommendation metadata
- `POST /api/chat`
  - Input: `{ coffeeId, messages, mode? }`
  - Output: `{ response }`
- `POST /api/places`
  - Input: `{ lat, lng }`
  - Output: nearby cafe list (or empty fallback)

## Data and Persistence

- Coffee beans: `data/coffees.ts`
- Drinks: `data/drinks.ts`
- Recommendation logic: `lib/recommendation.ts` and `lib/drink-recommendation.ts`
- Passport and latest recommendation are persisted in browser `localStorage`
  - behavior is per device/browser session by default

## Demo Flow (60-90 seconds)

1. Start on Home, click **Start your journey**
2. Take/upload a selfie and analyze vibe
3. Show coffee recommendation + "why" summary + order suggestion
4. Open chat with the matched coffee
5. Open Passport to show stamp unlock + visa stickers
6. Optionally open Nearby tab

## Resilience and Cost Controls

- Demo mode avoids live API spend and quota risks
- Real mode gracefully falls back on API/network failure
- If Gemini returns `429`, switch to Demo mode in `/settings`

## Current Repo Health Notes

- Type check and production build pass
- `.env` files are ignored from git; `.env.example` remains allowed
- There are currently local uncommitted changes from active development

## Optional Next Step: CI/CD

A lightweight CI pipeline is recommended (not overkill) before final judging:

- run on PR/push to `main`
- install deps
- type check
- production build

This gives confidence that future commits do not break demo-critical flows.
