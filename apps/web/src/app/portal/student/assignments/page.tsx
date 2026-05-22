"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Submission = {
  id: string;
  status: string;
  score?: number;
  assignment: { title: string; dueDate: string; course?: { title: string } };
};

export default function StudentAssignmentsPage() {
  const { data, loading, error } = usePortalApi<Submission[]>("/student/assignments");
  const items = data || [];

  return (
    <PortalPageShell title="Assignments" description="Submit and track assignments" loading={loading} error={error} empty={items.length === 0}>
      <section className="space-y-3">
        {items.map((s) => (
          <article key={s.id} className="card flex flex-wrap justify-between gap-3">
            <section>
              <p className="font-semibold">{s.assignment.title}</p>
              <p className="text-sm text-slate-500">{s.assignment.course?.title} · Due {new Date(s.assignment.dueDate).toLocaleDateString()}</p>
            </section>
            <section className="flex items-center gap-2">
              {s.score != null && <span className="text-sm font-medium text-brand-600">Score: {s.score}</span>}
              <span className={`text-xs px-2 py-1 rounded-full ${s.status === "SUBMITTED" || s.status === "GRADED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {s.status}
              </span>
            </section>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
