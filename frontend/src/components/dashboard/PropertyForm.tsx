"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminCreateProperty, adminUpdateProperty, getApiBase } from "@/lib/api";
import { PROPERTY_TYPES } from "@/lib/constants";
import type { PropertyDetail } from "@/lib/types";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function PropertyForm({
  property,
  onSuccess,
}: {
  property?: PropertyDetail;
  onSuccess?: (slug: string) => void;
}) {
  const { token } = useAdminAuth();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: property?.title ?? "",
    property_type: property?.property_type ?? "open_plot",
    status: property?.status ?? "available",
    location: property?.location ?? "",
    city: property?.city ?? "Hyderabad",
    state: property?.state ?? "Telangana",
    price: property?.price?.toString() ?? "",
    price_on_request: property?.price_on_request ?? false,
    area_value: property?.area_value?.toString() ?? "",
    area_unit: property?.area_unit ?? "sq_yd",
    short_description: property?.short_description ?? "",
    description: property?.description ?? "",
    is_featured: property?.is_featured ?? false,
    is_demo: property?.is_demo ?? false,
    cover_image_url: property?.cover ?? "",
    documentation_details: property?.documentation_details ?? "",
  });

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setMessage("");
    const payload = {
      ...form,
      price: form.price_on_request || !form.price ? null : form.price,
      amenities: property?.amenities ?? [],
      nearby_landmarks: property?.nearby_landmarks ?? [],
    };
    try {
      const saved = property
        ? await adminUpdateProperty(token, property.slug, payload)
        : await adminCreateProperty(token, payload);
      setMessage("Saved successfully.");
      onSuccess?.(saved.slug);
    } catch {
      setMessage("Failed to save property.");
    }
  };

  const uploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token || !property || !e.target.files?.length) return;
    const fd = new FormData();
    Array.from(e.target.files).forEach((file) => fd.append("images", file));
    await fetch(`${getApiBase()}/properties/${property.slug}/upload_images/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    setMessage("Images uploaded.");
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
      <input className="field" placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)} required />
      <div className="grid gap-4 md:grid-cols-2">
        <select className="field" value={form.property_type} onChange={(e) => update("property_type", e.target.value)}>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select className="field" value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="negotiation">Under Negotiation</option>
        </select>
        <input className="field" placeholder="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
        <input className="field" placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
        <input className="field" placeholder="Price (INR)" value={form.price} onChange={(e) => update("price", e.target.value)} />
        <input className="field" placeholder="Area value" value={form.area_value} onChange={(e) => update("area_value", e.target.value)} />
        <input className="field" placeholder="Cover image URL" value={form.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.price_on_request} onChange={(e) => update("price_on_request", e.target.checked)} />
        Price on request
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_featured} onChange={(e) => update("is_featured", e.target.checked)} />
        Featured property
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_demo} onChange={(e) => update("is_demo", e.target.checked)} />
        Mark as demo/sample listing
      </label>
      <textarea className="field min-h-24" placeholder="Short description" value={form.short_description} onChange={(e) => update("short_description", e.target.value)} />
      <textarea className="field min-h-32" placeholder="Full description" value={form.description} onChange={(e) => update("description", e.target.value)} />
      <textarea className="field min-h-24" placeholder="Documentation details" value={form.documentation_details} onChange={(e) => update("documentation_details", e.target.value)} />
      {property && (
        <div>
          <label className="text-sm font-medium text-navy-800">Upload gallery images</label>
          <input type="file" multiple accept="image/*" onChange={uploadImages} className="mt-2 block w-full text-sm" />
        </div>
      )}
      <Button type="submit">Save Property</Button>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </form>
  );
}
