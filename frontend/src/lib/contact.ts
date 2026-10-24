import type { SiteSettings } from "./types";

export function resolveContact(settings: SiteSettings | null) {
  return {
    phone: settings?.phone || process.env.NEXT_PUBLIC_PHONE || "",
    whatsapp: settings?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "",
    email: settings?.email || process.env.NEXT_PUBLIC_EMAIL || "contact@arrskylineestates.com",
    address: settings?.address || "Hyderabad, Telangana, India",
    company: settings?.company_name || "ARR Skyline Estates",
    tagline: settings?.tagline || "Building Dreams. Creating Landmarks.",
  };
}

export function whatsappLink(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
