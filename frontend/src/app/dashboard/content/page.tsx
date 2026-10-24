"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminContentPage() {
  const { token } = useAdminAuth();
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSiteSettings().then((s) => s && setForm(s));
  }, []);

  if (!form) return <p>Loading content...</p>;

  const update = (key: keyof SiteSettings, value: string) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const save = async () => {
    if (!token || !form) return;
    await updateSiteSettings(token, form);
    setMessage("Site content and contact details updated.");
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-navy-900">Content & Contact</h1>
      <p className="mt-2 text-sm text-navy-600">Edit homepage copy, about content, and contact information.</p>
      <div className="mt-6 space-y-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
        {(
          [
            ["company_name", "Company name"],
            ["tagline", "Tagline"],
            ["phone", "Phone"],
            ["whatsapp", "WhatsApp (digits with country code)"],
            ["email", "Email"],
            ["address", "Address"],
            ["map_embed_url", "Google Maps embed URL"],
            ["hero_heading", "Hero heading"],
            ["hero_subheading", "Hero subheading"],
            ["intro_heading", "Intro heading"],
            ["intro_body", "Intro body"],
            ["about_intro", "About intro"],
            ["vision", "Vision"],
            ["mission", "Mission"],
            ["values_text", "Values"],
            ["commitment", "Commitment"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block font-medium text-navy-800">{label}</span>
            {key.includes("body") || key.includes("intro") || key.includes("subheading") || key === "commitment" || key === "vision" || key === "mission" || key === "values_text" ? (
              <textarea className="field min-h-24" value={form[key]} onChange={(e) => update(key, e.target.value)} />
            ) : (
              <input className="field" value={form[key]} onChange={(e) => update(key, e.target.value)} />
            )}
          </label>
        ))}
        <Button onClick={save}>Save Changes</Button>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
      </div>
      <p className="mt-6 text-sm text-navy-600">
        Manage testimonials and gallery images via Django admin at <code>/admin/</code> or extend this dashboard as needed.
      </p>
    </div>
  );
}
