"use client";

import { Phone } from "lucide-react";
import { resolveContact, telLink, whatsappLink } from "@/lib/contact";
import type { SiteSettings } from "@/lib/types";

export function FloatingActions({ settings }: { settings: SiteSettings | null }) {
  const contact = resolveContact(settings);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3">
      {contact.phone && (
        <a
          href={telLink(contact.phone)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-white shadow-lg transition hover:bg-navy-800"
          aria-label="Call now"
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
      {contact.whatsapp && (
        <a
          href={whatsappLink(contact.whatsapp, "Hello ARR Skyline Estates, I would like to enquire about a property.")}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-500"
          aria-label="WhatsApp"
        >
          WA
        </a>
      )}
    </div>
  );
}
