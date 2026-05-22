"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type ClassSubject = {
  class: { id?: string; name: string; students?: { user: { firstName: string; lastName: string; email: string } }[] };
  subject: { name: string };
};

export default function TeacherClassesPage() {
  const { data, loading, error } = usePortalApi<ClassSubject[]>("/teacher/classes");
  const classes = data || [];

  return (
    <PortalPageShell title="My Classes" description="Classes and students you teach" loading={loading} error={error} empty={classes.length === 0}>
      <section className="space-y-4">
        {classes.map((c, i) => (
          <article key={i} className="card">
            <header className="mb-4">
              <h2 className="font-semibold text-lg">{c.class.name}</h2>
              <p className="text-sm text-slate-500">{c.subject.name}</p>
            </header>
            <ul className="space-y-2">
              {(c.class.students || []).map((s, j) => (
                <li key={j} className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span>{s.user.firstName} {s.user.lastName}</span>
                  <span className="text-slate-500">{s.user.email}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
