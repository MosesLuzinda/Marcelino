import { PageHero } from "@/components/public/PageHero";
import Link from "next/link";

export default function AcademicsPage() {
  return (
    <>
      <PageHero title="Academics" subtitle="Rigorous curriculum for global success" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8">
        <section className="grid md:grid-cols-3 gap-8">
          {["Sciences", "Humanities", "Technology"].map((dept) => (
            <article key={dept} className="card hover:shadow-xl transition">
              <h3 className="font-display text-xl font-bold mb-2">{dept}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Comprehensive programs designed for academic excellence and real-world application.</p>
              <Link href="/courses" className="text-brand-600 font-medium hover:underline">View Courses →</Link>
            </article>
          ))}
        </section>
      </section>
    </>
  );
}
