import { PageHero } from "@/components/public/PageHero";
import { Download } from "lucide-react";

export default function DownloadsPage() {
  const files = [
    { title: "Admission Form 2025", category: "Admissions" },
    { title: "School Calendar", category: "Academic" },
    { title: "Parent Handbook", category: "General" },
  ];
  return (
    <>
      <PageHero title="Download Center" subtitle="Forms, calendars, and resources" />
      <section className="py-16 mx-auto max-w-3xl px-4 lg:px-8 space-y-4">
        {files.map((f) => (
          <article key={f.title} className="card flex items-center justify-between">
            <section>
              <p className="font-semibold">{f.title}</p>
              <p className="text-sm text-slate-500">{f.category}</p>
            </section>
            <button className="p-3 rounded-xl bg-brand-100 dark:bg-brand-900 text-brand-600"><Download className="h-5 w-5" /></button>
          </article>
        ))}
      </section>
    </>
  );
}
