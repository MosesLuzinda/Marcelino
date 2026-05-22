"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Attempt = {
  id: string;
  score: number | null;
  submittedAt: string | null;
  exam: { title: string; duration: number; status?: string };
};

export default function StudentExamsPage() {
  const { data, loading, error } = usePortalApi<Attempt[]>("/student/exams");
  const exams = data || [];

  return (
    <PortalPageShell title="Online Exams" description="Take timed assessments" loading={loading} error={error} empty={exams.length === 0}>
      <section className="space-y-3">
        {exams.map((e) => (
          <article key={e.id} className="card flex flex-wrap justify-between gap-3">
            <section>
              <p className="font-semibold">{e.exam.title}</p>
              <p className="text-sm text-slate-500">{e.exam.duration} minutes</p>
            </section>
            <section className="text-right">
              {e.score != null ? (
                <p className="font-bold text-brand-600">{e.score}%</p>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-accent-teal/10 text-accent-teal">Available</span>
              )}
              {e.submittedAt && <p className="text-xs text-slate-500 mt-1">Submitted {new Date(e.submittedAt).toLocaleDateString()}</p>}
            </section>
          </article>
        ))}
      </section>
    </PortalPageShell>
  );
}
