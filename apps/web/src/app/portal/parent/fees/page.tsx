"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Smartphone, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

const PROVIDERS = [
  { id: "FLUTTERWAVE", name: "Flutterwave", desc: "Card, Bank, Mobile Money" },
  { id: "MTN_MOMO", name: "MTN MoMo", desc: "MTN Mobile Money" },
  { id: "AIRTEL_MONEY", name: "Airtel Money", desc: "Airtel Mobile Money" },
  { id: "STRIPE", name: "Stripe", desc: "Visa / Mastercard" },
  { id: "PAYPAL", name: "PayPal", desc: "PayPal account" },
];

function ParentFeesContent() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [paying, setPaying] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paidBanner = searchParams.get("paid") === "1";

  function loadInvoices() {
    if (!token) return;
    setLoading(true);
    api("/parent/fees", { token })
      .then((r) => {
        if (!r.success) setError(r.error || "Failed to load fees");
        else setInvoices((r.data as Record<string, unknown>[]) || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadInvoices();
  }, [token]);

  async function checkout(invoiceId: string, provider: string) {
    setPaying(invoiceId);
    setPayError(null);
    try {
      const res = await api<{ checkoutUrl?: string; reference?: string }>("/fees/checkout", {
        method: "POST",
        token: token!,
        body: JSON.stringify({ invoiceId, provider }),
      });
      if (!res.success || !res.data?.checkoutUrl) {
        setPayError(res.error || "Could not start payment. Is the API running on port 4000?");
        return;
      }
      window.location.assign(res.data.checkoutUrl);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Payment failed to start");
    } finally {
      setPaying(null);
    }
  }

  return (
    <section className="space-y-8">
      <header>
        <h1 className="font-display text-2xl font-bold">Fees & Payments</h1>
        <p className="text-slate-500">View invoices and pay securely online.</p>
      </header>

      {paidBanner && (
        <article className="card flex items-center gap-3 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <p className="text-sm text-green-800 dark:text-green-200">Your payment was recorded. Thank you!</p>
        </article>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {payError && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{payError}</p>}
      {loading && <p className="text-slate-500">Loading invoices...</p>}

      <section className="space-y-4">
        {!loading && invoices.length === 0 && (
          <article className="card text-center text-slate-500 py-8">No invoices found.</article>
        )}
        {invoices.map((inv) => {
          const invoice = inv as {
            id: string;
            invoiceNo: string;
            total: number;
            paidAmount: number;
            status: string;
            student: { user: { firstName: string; lastName: string } };
          };
          const remaining = Number(invoice.total) - Number(invoice.paidAmount);
          return (
            <article key={invoice.id} className="card">
              <section className="flex flex-wrap justify-between gap-4 mb-4">
                <section>
                  <p className="font-semibold">{invoice.invoiceNo}</p>
                  <p className="text-sm text-slate-500">
                    {invoice.student?.user?.firstName} {invoice.student?.user?.lastName}
                  </p>
                </section>
                <section className="text-right">
                  <p className="text-2xl font-bold">UGX {remaining.toLocaleString()}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </section>
              </section>
              {invoice.status !== "PAID" && (
                <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => checkout(invoice.id, p.id)}
                      disabled={paying === invoice.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-accent-teal hover:bg-accent-teal/5 transition text-left disabled:opacity-50"
                    >
                      {p.id.includes("MOMO") || p.id.includes("AIRTEL") ? (
                        <Smartphone className="h-5 w-5 text-accent-teal" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-accent-teal" />
                      )}
                      <section>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.desc}</p>
                      </section>
                    </button>
                  ))}
                </section>
              )}
            </article>
          );
        })}
      </section>
    </section>
  );
}

export default function ParentFeesPage() {
  return (
    <Suspense fallback={<p className="text-slate-500 p-8">Loading fees...</p>}>
      <ParentFeesContent />
    </Suspense>
  );
}
