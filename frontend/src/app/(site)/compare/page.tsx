"use client";

import { useEffect, useState } from "react";
import { compareProperties } from "@/lib/api";
import type { PropertyDetail } from "@/lib/types";
import { useCompare } from "@/context/CompareContext";
import { formatArea, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function ComparePage() {
  const { compare, clear } = useCompare();
  const [items, setItems] = useState<PropertyDetail[]>([]);

  useEffect(() => {
    if (!compare.length) {
      setItems([]);
      return;
    }
    compareProperties(compare).then(setItems).catch(() => setItems([]));
  }, [compare]);

  return (
    <div className="section-padding">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl text-navy-900">Compare Properties</h1>
          {!!compare.length && (
            <Button variant="secondary" onClick={clear}>
              Clear comparison
            </Button>
          )}
        </div>
        {!compare.length && <p className="mt-6 text-navy-600">Add up to 4 properties using the compare icon on listing cards.</p>}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full rounded-2xl border border-navy-100 bg-white text-sm shadow-soft">
            <tbody>
              {(
                [
                  { label: "Title", getter: (p: PropertyDetail) => p.title },
                  { label: "Location", getter: (p: PropertyDetail) => p.location },
                  { label: "Type", getter: (p: PropertyDetail) => p.property_type_label },
                  {
                    label: "Price",
                    getter: (p: PropertyDetail) => formatPrice(Number(p.price), p.price_on_request),
                  },
                  { label: "Area", getter: (p: PropertyDetail) => formatArea(p.area_value, p.area_unit) },
                  { label: "Status", getter: (p: PropertyDetail) => p.status_label },
                ] as const
              ).map(({ label, getter }) => (
                <tr key={label} className="border-t border-navy-100">
                  <th className="bg-navy-50 px-4 py-3 text-left font-semibold text-navy-800">{label}</th>
                  {items.map((p) => (
                    <td key={`${label}-${p.id}`} className="px-4 py-3">
                      {getter(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
