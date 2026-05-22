"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Analytics = { subject: string; average: number; atRisk: boolean };

export default function TeacherGradesPage() {
  const { data, loading, error } = usePortalApi<Analytics[]>("/teacher/analytics");
  const items = data || [];

  return (
    <PortalPageShell title="Grades" description="Class performance by subject" loading={loading} error={error} empty={items.length === 0}>
      <article className="card">
        <ul className="space-y-3">
          {items.map((g, i) => (
            <li key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="font-medium">{g.subject}</span>
              <section className="flex items-center gap-2">
                <span className="font-semibold text-brand-600">{g.average.toFixed(1)}% avg</span>
                {g.atRisk && <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">At risk</span>}
              </section>
            </li>
          ))}
        </ul>
      </article>
    </PortalPageShell>
  );
}
