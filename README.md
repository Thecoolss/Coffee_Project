# Bean There

Bean There is a mobile-first web app that turns a selfie into a playful coffee journey.
Users can take or upload a photo, receive a vibe-based coffee recommendation, unlock passport stamps, and chat with the matched coffee personality.

## Features

- Photo input with two paths: upload from gallery or capture from webcam/camera
- Vibe analysis with Gemini mode and local demo fallback mode
- Coffee bean recommendation with a short "why from your photo" explanation
- Practical drink suggestion for the recommended vibe
- Chat with animated coffee personas
- Passport booklet UI with stamps, date marks, and visa stickers
- Nearby cafes tab (separate from recommendation flow)
- Mobile-first UI with desktop phone frame

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- `motion` for page and character animation
- Local curated coffee and drink datasets
- Optional Gemini + Google Places integration

## Project Structure

- `app/` - Next.js routes, pages, and API routes
- `components/` - shared UI components
- `data/` - local coffee and drink datasets
- `lib/` - recommendation, AI, Places, storage, and theme logic
- `public/` - manifest and app icons
- `types/` - shared TypeScript types

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
```

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

- Use `NEXT_PUBLIC_AI_MODE=mock` to run without Gemini.
- Nearby cafes require Places to be enabled and a valid key.

## API Endpoints

- `POST /api/vibe`
  - Input: `{ imageBase64, mimeType?, mode? }`
  - Output: vibe analysis and recommendation metadata
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

## User Flow

1. Start on Home, click **Start your journey**
2. Take/upload a selfie and analyze vibe
3. Show coffee recommendation + "why" summary + order suggestion
4. Open chat with the matched coffee
5. Open Passport to show stamp unlock + visa stickers
6. Optionally open Nearby tab

## Modes

- **Demo mode:** uses local fallback behavior and does not require external AI calls.
- **Gemini mode:** uses Gemini for photo analysis and chat when `GEMINI_API_KEY` is available.
- **Places mode:** uses Google Places when `NEXT_PUBLIC_ENABLE_PLACES=true` and a valid Places key is configured.

## Notes

- `.env` and `.env.local` files are ignored by git.
- `.env.example` is safe to commit and should only contain variable names/placeholders.
- Passport progress is stored locally in the browser, not in a shared database.
