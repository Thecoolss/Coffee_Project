# Bean There

Bean There is a mobile-first hackathon web app for playful coffee discovery.  
Upload a photo, get a vibe-based coffee match, unlock passport stamps, and chat with your coffee persona.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- `motion` (Framer Motion) for page/character animation
- Local curated dataset in `data/coffees.ts`
- Optional Gemini + Google Places integrations

## Features

- Vibe analysis flow with `Demo` (mock) and `Gemini` (real) modes
- Local deterministic recommendation engine
- Coffee detail pages + passport progression
- Chat with coffee personalities (animated talking bean + country-themed visuals)
- Nearby cafes (optional Places API)
- Mobile-first UI with desktop phone frame for demos
- Lightweight PWA manifest/icons

## Run Locally

1. Install dependencies:
   - `npm install`
2. Create env file:
   - `cp .env.example .env.local`
3. Start dev server:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Environment Variables

- `NEXT_PUBLIC_AI_MODE` - `mock` or `real` (default UI mode)
- `GEMINI_API_KEY` - required for real Gemini responses
- `GEMINI_MODEL` - optional override (default: `gemini-2.0-flash`)
- `NEXT_PUBLIC_ENABLE_PLACES` - `true` to enable nearby cafes via Places
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - required when Places is enabled

## API Endpoints

- `POST /api/vibe`
  - Body: `{ imageBase64, mimeType?, mode? }`
  - Returns: `{ vibes, summary }`
- `POST /api/chat`
  - Body: `{ coffeeId, messages, mode? }`
  - Returns: `{ response }`

## Data + Persistence

- Coffee catalog is local: `data/coffees.ts`
- Recommendation scoring is local: `lib/recommendation.ts`
- Passport progress is stored in browser `localStorage`
  - This means progress is per device/browser session by default

## Modes

- `Demo` mode:
  - No external AI required
  - Uses local fallback for vibe/chat
  - Best for stable live demos
- `Gemini` mode:
  - Uses Gemini through API routes
  - Falls back gracefully when quota/network issues happen

## Notes for Demo Day

- If Gemini returns `429`, switch to `Demo` mode in `/settings`
- Nearby cafes are optional and can stay disabled for a fully offline-safe demo

## Customize

- Coffee dataset and personality: `data/coffees.ts`
- Shared types: `types/index.ts`
- Theme and animated bean visuals: `lib/bean-theme.ts`, `components/talking-bean.tsx`
