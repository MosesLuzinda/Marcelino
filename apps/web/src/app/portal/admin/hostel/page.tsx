"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Hostel = { id: string; name: string; capacity: number; occupied: number };

export default function AdminHostelPage() {
  const { data, loading, error } = usePortalApi<Hostel[]>("/hostel");
  const hostels = data || [];

  return (
    <PortalPageShell title="Hostel" description="Boarding and occupancy" loading={loading} error={error} empty={hostels.length === 0}>
      <section className="grid sm:grid-cols-2 gap-4">
        {hostels.map((h) => (
          <article key={h.id} className="card">
            <p className="font-semibold">{h.name}</p>
            <p className="text-sm text-slate-500 mt-2">{h.occupied} / {h.capacity} beds occupied</p>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-accent-teal" style={{ width: `${(h.occupied / h.capacity) * 100}%` }} />
            </div>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
