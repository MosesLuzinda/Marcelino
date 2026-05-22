"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Grade = { subject: string; score: number; maxScore: number; grade?: string };

export default function StudentGradesPage() {
  const { data, loading, error } = usePortalApi<Grade[]>("/student/grades");
  const grades = data || [];

  return (
    <PortalPageShell title="Grades & Results" description="View your academic performance" loading={loading} error={error} empty={grades.length === 0}>
      <article className="card">
        <ul className="space-y-2">
          {grades.map((g, i) => (
            <li key={i} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="font-medium">{g.subject}</span>
              <span className="text-brand-600 font-semibold">
                {g.score}/{g.maxScore} {g.grade && `(${g.grade})`}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </PortalPageShell>
  );
}
