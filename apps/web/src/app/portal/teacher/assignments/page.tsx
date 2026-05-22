"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Assignment = {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  course?: { title: string };
  submissions?: { id: string; status: string }[];
};

export default function TeacherAssignmentsPage() {
  const { data, loading, error } = usePortalApi<Assignment[]>("/teacher/assignments");
  const items = data || [];

  return (
    <PortalPageShell title="Assignments" description="Create and grade assignments" loading={loading} error={error} empty={items.length === 0}>
      <section className="space-y-3">
        {items.map((a) => (
          <article key={a.id} className="card flex flex-wrap justify-between gap-3">
            <section>
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-slate-500">{a.course?.title} · Due {new Date(a.dueDate).toLocaleDateString()}</p>
            </section>
            <section className="text-right">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{a.status}</span>
              <p className="text-xs text-slate-500 mt-1">{a.submissions?.length || 0} submissions</p>
            </section>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
