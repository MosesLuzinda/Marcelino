"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Child = {
  studentId: string;
  student: { user: { firstName: string; lastName: string }; class?: { name: string } };
};

export default function ParentChildrenPage() {
  const { data, loading, error } = usePortalApi<Child[]>("/parent/children");
  const children = data || [];

  return (
    <PortalPageShell title="My Children" description="Students linked to your account" loading={loading} error={error} empty={children.length === 0}>
      <section className="grid sm:grid-cols-2 gap-4">
        {children.map((c, i) => (
          <article key={i} className="card">
            <p className="font-semibold text-lg">{c.student.user.firstName} {c.student.user.lastName}</p>
            <p className="text-sm text-slate-500">{c.student.class?.name || "No class assigned"}</p>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
