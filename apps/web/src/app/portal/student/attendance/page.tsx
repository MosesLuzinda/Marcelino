"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";
import { StatCard } from "@/components/portal/PortalShell";

type AttendanceData = {
  records: { date: string; status: string; remarks?: string | null }[];
  summary: { total: number; present: number; rate: number };
};

export default function StudentAttendancePage() {
  const { data, loading, error } = usePortalApi<AttendanceData>("/student/attendance");
  const records = data?.records || [];

  return (
    <PortalPageShell title="Attendance" description="Track your attendance record" loading={loading} error={error} empty={records.length === 0}>
      {data?.summary && (
        <section className="grid sm:grid-cols-3 gap-4">
          <StatCard title="Total Days" value={data.summary.total} />
          <StatCard title="Present" value={data.summary.present} />
          <StatCard title="Rate" value={`${data.summary.rate.toFixed(1)}%`} />
        </section>
      )}
      <article className="card">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {records.map((r, i) => (
            <li key={i} className="flex justify-between items-center py-3">
              <span>{new Date(r.date).toLocaleDateString()}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${r.status === "PRESENT" ? "bg-green-100 text-green-700" : r.status === "LATE" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </PortalPageShell>
  );
}
