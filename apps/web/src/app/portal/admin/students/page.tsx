"use client";

import { AdminTablePage } from "@/components/portal/AdminTablePage";

export default function AdminStudentsPage() {
  return (
    <AdminTablePage
      title="Manage Students"
      description="Enrollment and student records"
      path="/admin/students"
      columns={["ID", "Name", "Email", "Class"]}
      getRowKey={(r) => (r.studentId as string) || "s"}
      renderRow={(r) => {
        const s = r as { studentId: string; user: { firstName: string; lastName: string; email: string }; class?: { name: string } };
        return [s.studentId, `${s.user?.firstName} ${s.user?.lastName}`, s.user?.email, s.class?.name || "—"];
      }}
    />
  );
}
