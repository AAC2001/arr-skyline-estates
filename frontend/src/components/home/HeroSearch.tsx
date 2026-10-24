"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PROPERTY_TYPES } from "@/lib/constants";

export function HeroSearch() {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [intent, setIntent] = useState("buy");

  const onSearch = () => {
    const params = new URLSearchParams();
    if (propertyType) params.set("property_type", propertyType);
    if (location) params.set("location", location);
    if (budget) params.set("max_price", budget);
    params.set("intent", intent);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur md:p-6">
      <div className="grid gap-3 md:grid-cols-5">
        <select className="field" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">Property type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input className="field" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input className="field" placeholder="Max budget (INR)" value={budget} onChange={(e) => setBudget(e.target.value)} />
        <select className="field" value={intent} onChange={(e) => setIntent(e.target.value)}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <Button onClick={onSearch} className="w-full">
          Search Properties
        </Button>
      </div>
    </div>
  );
}
