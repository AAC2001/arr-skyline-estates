"use client";

import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function DashboardHomePage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchDashboardStats(token).then(setStats).catch(() => setStats(null));
  }, [token]);

  const cards = [
    ["Total Properties", stats?.total_properties],
    ["Available", stats?.available_properties],
    ["Sold", stats?.sold_properties],
    ["Total Enquiries", stats?.total_enquiries],
    ["New Enquiries", stats?.new_enquiries],
    ["Construction Enquiries", stats?.construction_enquiries],
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-navy-900">Dashboard Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
            <p className="text-sm text-navy-600">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-navy-900">{value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
