"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";
import { StatCard } from "@/components/portal/PortalShell";

export default function ParentAttendancePage() {
  const { data: children } = usePortalApi<{ studentId: string }[]>("/parent/children");
  const studentId = children?.[0]?.studentId || "dev-student-profile";
  const { data, loading, error } = usePortalApi<{ records: { date: string; status: string }[]; rate: number }>(
    children ? `/parent/children/${studentId}/attendance` : ""
  );

  return (
    <PortalPageShell title="Attendance" description="Your child's attendance record" loading={loading} error={error} empty={!data?.records?.length}>
      {data && <StatCard title="Attendance Rate" value={`${data.rate.toFixed(1)}%`} />}
      <article className="card">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {(data?.records || []).map((r, i) => (
            <li key={i} className="flex justify-between py-3 text-sm">
              <span>{new Date(r.date).toLocaleDateString()}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "PRESENT" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.status}</span>
            </li>
          ))}
        </ul>
      </article>
    </PortalPageShell>
  );
}
