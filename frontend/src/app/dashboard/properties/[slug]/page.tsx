"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyForm } from "@/components/dashboard/PropertyForm";
import { fetchProperty } from "@/lib/api";
import type { PropertyDetail } from "@/lib/types";

export default function EditPropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);

  useEffect(() => {
    fetchProperty(slug).then(setProperty).catch(() => setProperty(null));
  }, [slug]);

  if (!property) return <p>Loading property...</p>;

  return (
    <div>
      <h1 className="font-display text-3xl text-navy-900">Edit Property</h1>
      <div className="mt-6">
        <PropertyForm property={property} />
      </div>
    </div>
  );
}
