import { PassportState } from "@/types";

const PASSPORT_KEY = "coffee-passport-state-v1";
const RECOMMENDATION_KEY = "coffee-passport-current-recommendation";

const defaultPassport: PassportState = {
  unlockedCoffeeIds: [],
  unlockedCountries: [],
  badges: []
};

export function getPassport(): PassportState {
  if (typeof window === "undefined") return defaultPassport;
  const raw = localStorage.getItem(PASSPORT_KEY);
  if (!raw) return defaultPassport;
  try {
    return JSON.parse(raw) as PassportState;
  } catch {
    return defaultPassport;
  }
}

export function savePassport(state: PassportState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PASSPORT_KEY, JSON.stringify(state));
}

export function unlockCoffee(coffeeId: string, country: string): PassportState {
  const current = getPassport();
  const next: PassportState = {
    unlockedCoffeeIds: Array.from(new Set([...current.unlockedCoffeeIds, coffeeId])),
    unlockedCountries: Array.from(new Set([...current.unlockedCountries, country])),
    badges: [...current.badges]
  };

  if (next.unlockedCoffeeIds.length >= 3 && !next.badges.includes("First Flight")) {
    next.badges.push("First Flight");
  }
  if (next.unlockedCountries.length >= 5 && !next.badges.includes("World Sipper")) {
    next.badges.push("World Sipper");
  }
  if (next.unlockedCoffeeIds.length >= 10 && !next.badges.includes("Passport Pro")) {
    next.badges.push("Passport Pro");
  }

  savePassport(next);
  return next;
}

export function saveCurrentRecommendation(coffeeId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(RECOMMENDATION_KEY, coffeeId);
}

export function getCurrentRecommendation(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(RECOMMENDATION_KEY);
}
