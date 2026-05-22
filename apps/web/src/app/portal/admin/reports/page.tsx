"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Insights = { insights: { title: string; description: string; value: string | number }[] };

export default function AdminReportsPage() {
  const { data, loading, error } = usePortalApi<Insights>("/analytics/insights");

  return (
    <PortalPageShell title="Reports" description="School-wide analytics" loading={loading} error={error}>
      <section className="grid sm:grid-cols-2 gap-4">
        {(data?.insights || []).map((ins, i) => (
          <article key={i} className="card">
            <p className="text-2xl font-bold text-brand-600">{ins.value}</p>
            <p className="font-semibold mt-2">{ins.title}</p>
            <p className="text-sm text-slate-500">{ins.description}</p>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
