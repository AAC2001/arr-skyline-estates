"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { adminDeleteProperty, adminListProperties } from "@/lib/api";
import type { PropertyListItem } from "@/lib/types";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { formatPrice } from "@/lib/utils";

export default function AdminPropertiesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<PropertyListItem[]>([]);

  const load = () => {
    if (!token) return;
    adminListProperties(token).then(setItems).catch(() => setItems([]));
  };

  useEffect(load, [token]);

  const onDelete = async (slug: string) => {
    if (!token || !confirm("Delete this property?")) return;
    await adminDeleteProperty(token, slug);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-navy-900">Property Management</h1>
        <Button href="/dashboard/properties/new">Add Property</Button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-navy-50 text-left text-navy-700">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-navy-100">
                <td className="px-4 py-3">
                  {p.title}
                  {p.is_demo && <span className="ml-2 text-xs text-gold-600">Demo</span>}
                </td>
                <td className="px-4 py-3">{p.property_type_label}</td>
                <td className="px-4 py-3">{p.status_label}</td>
                <td className="px-4 py-3">{formatPrice(Number(p.price), p.price_on_request)}</td>
                <td className="px-4 py-3">{p.is_featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/properties/${p.slug}`} className="mr-3 text-gold-600 hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => onDelete(p.slug)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
