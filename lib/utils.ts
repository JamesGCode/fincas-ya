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
