"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Exam = { id: string; title: string; status: string; duration: number; questions?: unknown[]; attempts?: { score?: number }[] };

export default function TeacherExamsPage() {
  const { data, loading, error } = usePortalApi<Exam[]>("/teacher/exams");
  const exams = data || [];

  return (
    <PortalPageShell title="Exams" description="Manage online assessments" loading={loading} error={error} empty={exams.length === 0}>
      <section className="space-y-3">
        {exams.map((e) => (
          <article key={e.id} className="card flex justify-between">
            <section>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-slate-500">{e.duration} min · {e.questions?.length || 0} questions</p>
            </section>
            <span className="text-xs px-2 py-1 rounded-full bg-accent-teal/10 text-accent-teal h-fit">{e.status}</span>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
