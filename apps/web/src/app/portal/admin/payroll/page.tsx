"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type PayrollRun = { id: string; name: string; period: string; entries?: { id: string }[] };

export default function AdminPayrollPage() {
  const { data, loading, error } = usePortalApi<PayrollRun[]>("/admin/payroll");
  const runs = data || [];

  return (
    <PortalPageShell title="Payroll" description="Staff payroll runs" loading={loading} error={error} empty={runs.length === 0}>
      <section className="space-y-3">
        {runs.map((r) => (
          <article key={r.id} className="card flex justify-between">
            <section>
              <p className="font-semibold">{r.name}</p>
              <p className="text-sm text-slate-500">Period {r.period}</p>
            </section>
            <span className="text-sm text-slate-500">{r.entries?.length || 0} entries</span>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
