"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/portal/PortalShell";
import { Users, FileText, BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api("/teacher/dashboard", { token })
      .then((r) => {
        if (!r.success) setError(r.error || "Failed to load");
        else setData(r.data as Record<string, unknown>);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-slate-500">Manage your classes and track student progress.</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </header>
      {loading && <p className="text-slate-500">Loading dashboard...</p>}
      <section className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Classes" value={(data?.classes as unknown[])?.length || 0} icon={Users} />
        <StatCard title="Assignments" value={data?.assignmentCount as number || 0} icon={FileText} />
        <StatCard title="Notifications" value={(data?.notifications as unknown[])?.length || 0} icon={BookOpen} />
      </section>
      <article className="card">
        <h2 className="font-semibold mb-4">My Classes</h2>
        <section className="grid md:grid-cols-2 gap-4">
          {((data?.classes as { class: { name: string }; subject: { name: string } }[]) || []).map((c, i) => (
            <section key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="font-semibold">{c.class?.name}</p>
              <p className="text-sm text-slate-500">{c.subject?.name}</p>
            </section>
          ))}
        </section>
      </article>
    </section>
  );
}
