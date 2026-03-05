import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCOP = (value: number | string) => {
  const num =
    typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) : value;
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatPriceInput = (value: number | string) => {
  const num =
    typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) : value;
  if (isNaN(num) || num === 0) return "";
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(num);
};

export const parseCOP = (value: string) => {
  const cleanValue =
    typeof value === "string" ? value.replace(/\D/g, "") : String(value);
  return cleanValue ? parseInt(cleanValue, 10) : 0;
};

export const getSeededRating = (seed: string) => {
  // Simple hash function for the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use the hash to get a value between 4.0 and 4.6
  const pseudoRandom = (Math.abs(hash) % 7) / 10; // 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6
  const rating = 4.0 + pseudoRandom;

  return rating.toFixed(1);
};
