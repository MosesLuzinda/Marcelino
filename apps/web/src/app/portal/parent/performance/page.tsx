"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Performance = {
  grades: { subject: string; score: number; grade?: string }[];
  exams: { exam: { title: string }; score: number | null }[];
};

export default function ParentPerformancePage() {
  const { data: children } = usePortalApi<{ studentId: string }[]>("/parent/children");
  const studentId = children?.[0]?.studentId || "dev-student-profile";
  const { data, loading, error } = usePortalApi<Performance>(children ? `/parent/children/${studentId}/performance` : "");

  return (
    <PortalPageShell title="Performance" description="Grades and exam results" loading={loading} error={error}>
      <section className="grid lg:grid-cols-2 gap-6">
        <article className="card">
          <h2 className="font-semibold mb-4">Grades</h2>
          <ul className="space-y-2">
            {(data?.grades || []).map((g, i) => (
              <li key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span>{g.subject}</span>
                <span className="font-semibold text-brand-600">{g.score}% {g.grade && `(${g.grade})`}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2 className="font-semibold mb-4">Exams</h2>
          <ul className="space-y-2">
            {(data?.exams || []).map((e, i) => (
              <li key={i} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <span>{e.exam.title}</span>
                <span className="font-semibold">{e.score != null ? `${e.score}%` : "Pending"}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </PortalPageShell>
  );
}
