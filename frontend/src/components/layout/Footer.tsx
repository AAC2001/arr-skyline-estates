import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PROPERTY_TYPES, SERVICES } from "@/lib/constants";
import { resolveContact, telLink, whatsappLink } from "@/lib/contact";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const contact = resolveContact(settings);

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-navy-200">{settings?.intro_body ?? contact.tagline}</p>
          <p className="text-xs uppercase tracking-widest text-gold-400">{contact.tagline}</p>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["/properties", "Browse Properties"],
              ["/construction", "Construction Services"],
              ["/about", "About Us"],
              ["/contact", "Contact"],
              ["/compare", "Compare Properties"],
              ["/privacy", "Privacy Policy"],
              ["/terms", "Terms & Conditions"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-gold-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg text-white">Categories & Services</h3>
          <ul className="space-y-1 text-sm text-navy-200">
            {PROPERTY_TYPES.slice(0, 5).map((t) => (
              <li key={t.value}>
                <Link href={`/properties?property_type=${t.value}`} className="hover:text-gold-300">
                  {t.label}
                </Link>
              </li>
            ))}
            {SERVICES.slice(0, 4).map((s) => (
              <li key={s.title}>{s.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-lg text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-gold-400" />
              {contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold-400" />
              <a href={telLink(contact.phone)}>{contact.phone || "Configure phone in admin"}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-400" />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {[
              ["Facebook", settings?.facebook_url],
              ["Instagram", settings?.instagram_url],
              ["LinkedIn", settings?.linkedin_url],
              ["YouTube", settings?.youtube_url],
            ].map(([label, url]) =>
              url ? (
                <a key={label as string} href={url as string} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-navy-700 px-3 py-1 hover:border-gold-400">
                  <Globe className="h-3 w-3" /> {label}
                </a>
              ) : null,
            )}
          </div>
          {contact.whatsapp && (
            <a
              href={whatsappLink(contact.whatsapp, "Hello ARR Skyline Estates, I would like to enquire.")}
              className="mt-4 inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              WhatsApp Us
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-navy-800 py-4 text-center text-xs text-navy-400">
        © {new Date().getFullYear()} {contact.company}. All rights reserved.
      </div>
    </footer>
  );
}
