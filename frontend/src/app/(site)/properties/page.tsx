import { Suspense } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { fetchProperties, fetchRecentProperties } from "@/lib/api";

export const metadata = { title: "Properties" };

async function PropertyResults({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const params: Record<string, string> = {};
  Object.entries(sp).forEach(([k, v]) => {
    if (v) params[k] = v;
  });

  const [data, recent] = await Promise.all([
    fetchProperties(params),
    params.featured ? Promise.resolve([]) : fetchRecentProperties().catch(() => []),
  ]);

  return (
    <>
      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.results.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {!data.results.length && <p className="text-navy-600">No properties match your filters.</p>}
      {!!recent.length && !params.search && (
        <section className="mt-12">
          <h2 className="font-display text-2xl text-navy-900">Recently Added</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recent.map((property) => (
              <PropertyCard key={`recent-${property.id}`} property={property} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="font-display text-4xl text-navy-900">Property Marketplace</h1>
        <p className="mt-2 max-w-3xl text-navy-600">
          Browse demo and live listings managed from the admin dashboard. Filter by location, type, budget, and size.
        </p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-navy-100" />}>
            <PropertyFilters />
          </Suspense>
        </div>
        <div className="mt-10">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-navy-100" />}>
            <PropertyResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
