"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/portal/PortalShell";
import { GraduationCap, ClipboardCheck, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function ParentDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api("/parent/dashboard", { token })
      .then((r) => {
        if (!r.success) setError(r.error || "Failed to load");
        else setData(r.data as Record<string, unknown>);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  const pendingFees = ((data?.invoices as { status: string; total: number }[]) || []).filter((i) => i.status !== "PAID");

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold">Parent Dashboard</h1>
        <p className="text-slate-500">Monitor your children&apos;s progress and school fees.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </header>
      {loading && <p className="text-slate-500">Loading dashboard...</p>}
      <section className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Children" value={(data?.parent as { children: unknown[] })?.children?.length || 0} icon={GraduationCap} />
        <StatCard title="Attendance Records" value={(data?.attendance as unknown[])?.length || 0} icon={ClipboardCheck} />
        <StatCard title="Pending Fees" value={pendingFees.length} icon={CreditCard} />
      </section>
      {pendingFees.length > 0 && (
        <article className="card border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <h2 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Outstanding Fees</h2>
          <p className="text-sm mb-4">You have {pendingFees.length} unpaid invoice(s).</p>
          <Link href="/portal/parent/fees" className="btn-primary text-sm">Pay Now</Link>
        </article>
      )}
    </section>
  );
}
