"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { StatCard } from "@/components/portal/PortalShell";
import { Users, GraduationCap, CreditCard, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

const COLORS = ["#0ea5e9", "#14b8a6", "#D4AF37", "#8b5cf6"];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [insights, setInsights] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      api("/admin/dashboard", { token }),
      api("/analytics/insights", { token }),
    ])
      .then(([dash, ins]) => {
        if (!dash.success) setError(dash.error || "Failed to load dashboard");
        else setData(dash.data as Record<string, unknown>);
        if (ins.success) setInsights((ins.data as { insights: Record<string, unknown>[] })?.insights || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  const attendanceData = ((data?.attendance as { status: string; _count: number }[]) || []).map((a) => ({
    name: a.status,
    value: a._count,
  }));

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500">School management overview and analytics.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </header>
      {loading && <p className="text-slate-500">Loading dashboard...</p>}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Students" value={data?.students as number || 0} icon={Users} />
        <StatCard title="Teachers" value={data?.teachers as number || 0} icon={GraduationCap} />
        <StatCard title="Revenue (UGX)" value={Number(data?.revenue || 0).toLocaleString()} icon={CreditCard} />
        <StatCard title="Classes" value={data?.classes as number || 0} icon={BookOpen} />
      </section>
      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card">
          <h2 className="font-semibold mb-4">Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={attendanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {attendanceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
        <article className="card">
          <h2 className="font-semibold mb-4">AI Insights</h2>
          <ul className="space-y-3">
            {insights.map((ins, i) => (
              <li key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="font-medium">{ins.title as string}</p>
                <p className="text-sm text-slate-500">{ins.description as string}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}
