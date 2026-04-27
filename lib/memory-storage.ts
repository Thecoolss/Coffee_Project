import { CoffeeMemory } from "@/types";

const STORAGE_KEY = "bean-there-coffee-memories";

export function getCoffeeMemories(): CoffeeMemory[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as CoffeeMemory[];
  } catch {
    return [];
  }
}

export function saveCoffeeMemory(memory: CoffeeMemory) {
  const current = getCoffeeMemories();
  const updated = [memory, ...current];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteCoffeeMemory(id: string) {
  const current = getCoffeeMemories();
  const updated = current.filter((memory) => memory.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}