"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const ref = searchParams.get("ref");
    const mock = searchParams.get("mock") === "true";
    const paymentStatus = searchParams.get("status");

    if (!ref) {
      setStatus("failed");
      setMessage("Missing payment reference. Please try again from the fees page.");
      return;
    }

    if (paymentStatus === "failed" || paymentStatus === "cancelled") {
      setStatus("failed");
      setMessage("Payment was cancelled or failed.");
      return;
    }

    async function confirm() {
      if (!token) return;
      const res = await api<{ message?: string }>("/fees/confirm-mock", {
        method: "POST",
        token,
        body: JSON.stringify({ reference: ref, mock }),
      });

      if (res.success) {
        setStatus("success");
        setMessage(res.data?.message || "Payment completed successfully.");
        setTimeout(() => router.replace("/portal/parent/fees?paid=1"), 2500);
      } else {
        setStatus("failed");
        setMessage(res.error || "Could not confirm payment.");
      }
    }

    confirm();
  }, [token, searchParams, router]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center p-4">
      <article className="card max-w-md w-full text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-accent-teal mx-auto" />
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="font-display text-xl font-bold">Payment successful</h1>
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
            <p className="text-sm text-slate-500">Redirecting to fees...</p>
          </>
        )}
        {status === "failed" && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="font-display text-xl font-bold">Payment issue</h1>
            <p className="text-slate-600 dark:text-slate-400">{message}</p>
            <Link href="/portal/parent/fees" className="btn-primary inline-flex mt-4">
              Back to fees
            </Link>
          </>
        )}
      </article>
    </section>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent-teal" />
        </section>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
