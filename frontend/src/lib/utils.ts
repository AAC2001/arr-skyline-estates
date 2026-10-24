import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined, priceOnRequest?: boolean) {
  if (priceOnRequest || price == null) return "Price on request";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(value: string | number, unit: string) {
  const labels: Record<string, string> = {
    sq_yd: "sq. yd.",
    sq_ft: "sq. ft.",
    acres: "acres",
  };
  return `${value} ${labels[unit] ?? unit}`;
}
