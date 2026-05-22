"use client";

import { AdminTablePage } from "@/components/portal/AdminTablePage";

export default function AdminInventoryPage() {
  return (
    <AdminTablePage
      title="Inventory"
      description="Stock and supplies"
      path="/inventory/items"
      columns={["Item", "Category", "Qty", "Min stock"]}
      getRowKey={(r) => (r.id as string) || "i"}
      renderRow={(r) => {
        const low = Number(r.quantity) <= Number(r.minStock);
        return [
          <span key="n" className={low ? "text-amber-600 font-medium" : ""}>{r.name as string}</span>,
          r.category as string,
          String(r.quantity),
          String(r.minStock),
        ];
      }}
    />
  );
}
