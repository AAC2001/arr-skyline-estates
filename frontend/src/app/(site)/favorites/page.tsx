"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { fetchProperty } from "@/lib/api";
import type { PropertyListItem } from "@/lib/types";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [items, setItems] = useState<PropertyListItem[]>([]);

  useEffect(() => {
    Promise.all(
      favorites.map((slug) =>
        fetchProperty(slug)
          .then((p) => p as PropertyListItem)
          .catch(() => null),
      ),
    ).then((res) => setItems(res.filter(Boolean) as PropertyListItem[]));
  }, [favorites]);

  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="font-display text-4xl text-navy-900">Favourite Properties</h1>
        <p className="mt-2 text-navy-600">Saved locally on this device for quick access.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {!items.length && <p className="mt-6 text-navy-600">No favourites yet.</p>}
      </div>
    </div>
  );
}
