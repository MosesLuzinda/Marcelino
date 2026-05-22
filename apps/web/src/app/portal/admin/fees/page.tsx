"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Finance = {
  payments: { provider: string; _sum: { amount: number }; _count: number }[];
  overdue: number;
};

export default function AdminFinancePage() {
  const { data, loading, error } = usePortalApi<Finance>("/admin/reports/finance");

  return (
    <PortalPageShell title="Finance" description="Revenue and fee collection" loading={loading} error={error}>
      {data && (
        <section className="space-y-6">
          <article className="card">
            <p className="text-sm text-slate-500">Overdue invoices</p>
            <p className="text-3xl font-bold text-amber-600">{data.overdue}</p>
          </article>
          <article className="card">
            <h2 className="font-semibold mb-4">Payments by provider</h2>
            <ul className="space-y-3">
              {(data.payments || []).map((p, i) => (
                <li key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span>{p.provider}</span>
                  <span className="font-semibold">UGX {Number(p._sum?.amount || 0).toLocaleString()} ({p._count} txns)</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}
    </PortalPageShell>
  );
}
