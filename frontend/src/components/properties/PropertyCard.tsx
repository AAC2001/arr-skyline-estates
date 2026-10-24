"use client";

import { GitCompare, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCompare } from "@/context/CompareContext";
import { useFavorites } from "@/context/FavoritesContext";
import type { PropertyListItem } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/utils";

export function PropertyCard({ property }: { property: PropertyListItem }) {
  const { toggle: toggleFav, isFavorite } = useFavorites();
  const { toggle: toggleCompare, isCompared } = useCompare();

  return (
    <article className="group overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={
            property.cover ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
          }
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {property.is_demo && (
          <span className="absolute left-3 top-3 rounded-full bg-navy-900/90 px-3 py-1 text-xs font-semibold text-gold-300">
            Demo Listing
          </span>
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={() => toggleFav(property.slug)}
            className="rounded-full bg-white/90 p-2 text-navy-800 shadow"
            aria-label="Toggle favourite"
          >
            <Heart className={`h-4 w-4 ${isFavorite(property.slug) ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          <button
            onClick={() => toggleCompare(property.slug)}
            className="rounded-full bg-white/90 p-2 text-navy-800 shadow"
            aria-label="Compare property"
          >
            <GitCompare className={`h-4 w-4 ${isCompared(property.slug) ? "text-gold-600" : ""}`} />
          </button>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{property.property_type_label}</p>
            <h3 className="font-display text-lg text-navy-900">{property.title}</h3>
            <p className="text-sm text-navy-600">{property.location}</p>
          </div>
          <span className="rounded-full bg-navy-50 px-2 py-1 text-xs font-medium text-navy-700">{property.status_label}</span>
        </div>
        <p className="line-clamp-2 text-sm text-navy-600">{property.short_description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-navy-900">{formatPrice(Number(property.price), property.price_on_request)}</span>
          <span className="text-navy-600">{formatArea(property.area_value, property.area_unit)}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <Button href={`/properties/${property.slug}`} variant="secondary" className="flex-1 px-4 py-2 text-xs">
            View Details
          </Button>
          <Link
            href={`/contact?property=${property.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-950 hover:bg-gold-400"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </article>
  );
}
