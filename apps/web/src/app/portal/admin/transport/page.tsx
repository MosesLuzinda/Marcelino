"use client";

import { AdminTablePage } from "@/components/portal/AdminTablePage";

export default function AdminTransportPage() {
  return (
    <AdminTablePage
      title="Transport"
      description="Bus routes and vehicles"
      path="/transport/routes"
      columns={["Route", "Vehicle", "Stops"]}
      getRowKey={(r) => (r.id as string) || "r"}
      renderRow={(r) => [r.name as string, r.vehicle as string, String(r.stops)]}
    />
  );
}
