"use client";

import { AdminTablePage } from "@/components/portal/AdminTablePage";

export default function AdminTeachersPage() {
  return (
    <AdminTablePage
      title="Teachers"
      description="Manage teaching staff"
      path="/admin/teachers"
      columns={["Employee ID", "Name", "Email"]}
      getRowKey={(r) => (r.employeeId as string) || "t"}
      renderRow={(r) => {
        const t = r as { employeeId: string; user: { firstName: string; lastName: string; email: string } };
        return [t.employeeId, `${t.user?.firstName} ${t.user?.lastName}`, t.user?.email];
      }}
    />
  );
}
