import { mockParentFees } from "./dev-mock-data.js";

type MockInvoice = ReturnType<typeof mockParentFees>[number];

let invoices: MockInvoice[] = mockParentFees();

const pendingCheckouts = new Map<string, { invoiceId: string; provider: string; amount: number }>();

export function getDevInvoices(): MockInvoice[] {
  return invoices;
}

export function registerDevCheckout(reference: string, invoiceId: string, provider: string, amount: number) {
  pendingCheckouts.set(reference, { invoiceId, provider, amount });
}

export function completeDevPayment(reference: string): MockInvoice | null {
  const pending = pendingCheckouts.get(reference);
  if (!pending) return null;

  let updated: MockInvoice | null = null;
  invoices = invoices.map((inv) => {
    if (inv.id !== pending.invoiceId) return inv;
    updated = {
      ...inv,
      status: "PAID",
      paidAmount: inv.total,
      payments: [
        ...(inv.payments || []),
        {
          id: `pay-${reference}`,
          amount: pending.amount,
          status: "COMPLETED",
          provider: pending.provider,
          providerRef: reference,
        },
      ],
    };
    return updated;
  });

  pendingCheckouts.delete(reference);
  return updated;
}
