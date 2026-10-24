"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PROPERTY_TYPES } from "@/lib/constants";

export function PropertyFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/properties?${next.toString()}`);
  };

  return (
    <div className="grid gap-3 rounded-2xl border border-navy-100 bg-white p-4 shadow-soft md:grid-cols-2 lg:grid-cols-6">
      <input
        className="field"
        placeholder="Location"
        defaultValue={params.get("location") ?? ""}
        onBlur={(e) => update("location", e.target.value)}
      />
      <select className="field" defaultValue={params.get("property_type") ?? ""} onChange={(e) => update("property_type", e.target.value)}>
        <option value="">All types</option>
        {PROPERTY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <input className="field" placeholder="Min price" defaultValue={params.get("min_price") ?? ""} onBlur={(e) => update("min_price", e.target.value)} />
      <input className="field" placeholder="Max price" defaultValue={params.get("max_price") ?? ""} onBlur={(e) => update("max_price", e.target.value)} />
      <input className="field" placeholder="Min area" defaultValue={params.get("min_area") ?? ""} onBlur={(e) => update("min_area", e.target.value)} />
      <select className="field" defaultValue={params.get("ordering") ?? ""} onChange={(e) => update("ordering", e.target.value)}>
        <option value="">Sort by</option>
        <option value="price">Price: Low to High</option>
        <option value="-price">Price: High to Low</option>
        <option value="-created_at">Recently Added</option>
      </select>
    </div>
  );
}
