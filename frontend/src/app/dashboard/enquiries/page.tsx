"use client";

import { useEffect, useState } from "react";
import { fetchEnquiries, updateEnquiry } from "@/lib/api";
import type { Enquiry } from "@/lib/types";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminEnquiriesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<Enquiry[]>([]);

  const load = () => {
    if (!token) return;
    fetchEnquiries(token).then(setItems).catch(() => setItems([]));
  };

  useEffect(load, [token]);

  const patch = async (id: number, data: Partial<Enquiry>) => {
    if (!token) return;
    await updateEnquiry(token, id, data);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-navy-900">Enquiry Management</h1>
      <div className="mt-8 space-y-4">
        {items.map((e) => (
          <article key={e.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy-900">
                  {e.name} · {e.phone}
                </p>
                <p className="text-sm text-navy-600">
                  {e.enquiry_type} {e.property_title ? `· ${e.property_title}` : ""}
                </p>
                <p className="mt-2 text-sm text-navy-700">{e.message}</p>
              </div>
              <select
                className="field w-auto"
                value={e.status}
                onChange={(ev) => patch(e.id, { status: ev.target.value })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <textarea
              className="field mt-3 min-h-20"
              placeholder="Internal notes"
              defaultValue={e.internal_notes}
              onBlur={(ev) => patch(e.id, { internal_notes: ev.target.value })}
            />
          </article>
        ))}
        {!items.length && <p className="text-navy-600">No enquiries yet.</p>}
      </div>
    </div>
  );
}
