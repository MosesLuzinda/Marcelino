"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/portal/PortalShell";
import { ClipboardCheck, GraduationCap, FileText, Bell } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function StudentDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api("/student/dashboard", { token })
      .then((r) => {
        if (!r.success) setError(r.error || "Failed to load dashboard");
        else setData(r.data as Record<string, unknown>);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  const stats = data?.stats as { attendance?: number } | undefined;

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold">Student Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here&apos;s your academic overview.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </header>
      {loading && <p className="text-slate-500">Loading dashboard...</p>}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance Days" value={stats?.attendance || 0} icon={ClipboardCheck} />
        <StatCard title="Recent Grades" value={(data?.grades as unknown[])?.length || 0} icon={GraduationCap} />
        <StatCard title="Assignments" value={(data?.assignments as unknown[])?.length || 0} icon={FileText} />
        <StatCard title="Notifications" value={(data?.notifications as unknown[])?.length || 0} icon={Bell} />
      </section>
      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card">
          <h2 className="font-semibold mb-4">Recent Grades</h2>
          <ul className="space-y-2">
            {((data?.grades as { subject: string; score: number; grade?: string }[]) || []).map((g, i) => (
              <li key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span>{g.subject}</span>
                <span className="font-semibold text-brand-600">{g.score}% {g.grade && `(${g.grade})`}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2 className="font-semibold mb-4">Pending Assignments</h2>
          <ul className="space-y-2">
            {((data?.assignments as { assignment: { title: string; dueDate: string }; status: string }[]) || []).map((a, i) => (
              <li key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span>{a.assignment?.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${a.status === "SUBMITTED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  );
}
