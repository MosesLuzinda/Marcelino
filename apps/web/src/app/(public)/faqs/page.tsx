"use client";

import { useState } from "react";
import { PageHero } from "@/components/public/PageHero";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What are the admission requirements?", a: "Completed application form, previous school records, entrance assessment, and required documents." },
  { q: "How do I pay school fees?", a: "Through the Parent Portal using Flutterwave, MTN MoMo, Airtel Money, cards, or bank transfer." },
  { q: "What portals are available?", a: "Student, Teacher, Parent, and Admin portals — each with role-specific features." },
  { q: "Is financial aid available?", a: "Yes, merit scholarships and need-based assistance are available. Contact the finance office." },
];

export default function FaqsPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <PageHero title="FAQs" subtitle="Frequently asked questions" />
      <section className="py-16 mx-auto max-w-3xl px-4 lg:px-8 space-y-3">
        {faqs.map((f, i) => (
          <article key={i} className="card">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center text-left font-semibold">
              {f.q}
              <ChevronDown className={`h-5 w-5 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="mt-3 text-slate-600 dark:text-slate-400">{f.a}</p>}
          </article>
        ))}
      </section>
    </>
  );
}
