"use client";

import { usePortalApi } from "@/hooks/usePortalApi";
import { PortalPageShell } from "@/components/portal/PortalPageShell";

type Profile = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  locale?: string;
  studentProfile?: { studentId: string; class?: { name: string }; section?: { name: string } };
};

export default function StudentProfilePage() {
  const { data, loading, error } = usePortalApi<Profile>("/student/profile");

  return (
    <PortalPageShell title="Profile" description="Manage your account settings" loading={loading} error={error} empty={!data}>
      {data && (
        <article className="card space-y-4 max-w-lg">
          <section>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-semibold text-lg">{data.firstName} {data.lastName}</p>
          </section>
          <section>
            <p className="text-sm text-slate-500">Email</p>
            <p>{data.email}</p>
          </section>
          {data.phone && (
            <section>
              <p className="text-sm text-slate-500">Phone</p>
              <p>{data.phone}</p>
            </section>
          )}
          {data.studentProfile && (
            <>
              <section>
                <p className="text-sm text-slate-500">Student ID</p>
                <p>{data.studentProfile.studentId}</p>
              </section>
              <section>
                <p className="text-sm text-slate-500">Class</p>
                <p>{data.studentProfile.class?.name} {data.studentProfile.section?.name && `· Section ${data.studentProfile.section.name}`}</p>
              </section>
            </>
          )}
        </article>
      )}
    </PortalPageShell>
  );
}
