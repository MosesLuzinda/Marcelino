"use client";

import { AdminTablePage } from "@/components/portal/AdminTablePage";

export default function AdminLibraryPage() {
  return (
    <AdminTablePage
      title="Library"
      description="Books and catalog"
      path="/library/books"
      columns={["Title", "Author", "ISBN", "Available"]}
      getRowKey={(r) => (r.id as string) || "b"}
      renderRow={(r) => [r.title as string, r.author as string, r.isbn as string, String(r.available)]}
    />
  );
}
