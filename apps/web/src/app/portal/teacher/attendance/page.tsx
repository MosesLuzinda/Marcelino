"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type ClassSubject = { class: { id: string; name: string } };

export default function TeacherAttendancePage() {
  const { data: classes, loading: loadingClasses } = usePortalApi<ClassSubject[]>("/teacher/classes");
  const classId = classes?.[0]?.class?.id || "c1";
  const { data, loading, error } = usePortalApi<{ studentId: string; date: string; status: string }[]>(
    loadingClasses ? "" : `/teacher/attendance/${classId}`
  );

  return (
    <PortalPageShell
      title="Attendance"
      description={classes?.[0] ? `Recent attendance for ${classes[0].class.name}` : "Mark and review class attendance"}
      loading={loadingClasses || loading}
      error={error}
      empty={!data?.length}
    >
      <article className="card">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {(data || []).map((r, i) => (
            <li key={i} className="flex justify-between py-3 text-sm">
              <span>{new Date(r.date).toLocaleDateString()} · Student {r.studentId}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "PRESENT" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </PortalPageShell>
  );
}
