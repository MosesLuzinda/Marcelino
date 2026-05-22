"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type ClassRow = { id: string; name: string; sections?: { name: string }[]; students?: unknown[] };

export default function AdminClassesPage() {
  const { data, loading, error } = usePortalApi<ClassRow[]>("/admin/classes");
  const classes = data || [];

  return (
    <PortalPageShell title="Classes" description="Manage classes and sections" loading={loading} error={error} empty={classes.length === 0}>
      <section className="grid md:grid-cols-2 gap-4">
        {classes.map((c) => (
          <article key={c.id} className="card">
            <p className="font-semibold text-lg">{c.name}</p>
            <p className="text-sm text-slate-500 mt-1">{c.sections?.length || 0} sections · {c.students?.length || 0} students</p>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
