"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/dashboard/PropertyForm";

export default function NewPropertyPage() {
  const router = useRouter();
  return (
    <div>
      <h1 className="font-display text-3xl text-navy-900">Add Property</h1>
      <div className="mt-6">
        <PropertyForm onSuccess={(slug) => router.push(`/dashboard/properties/${slug}`)} />
      </div>
    </div>
  );
}
