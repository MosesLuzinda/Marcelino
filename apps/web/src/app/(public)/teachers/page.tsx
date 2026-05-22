import { PageHero } from "@/components/public/PageHero";

export default function TeachersPage() {
  const teachers = Array.from({ length: 6 }, (_, i) => ({
    name: `Teacher ${i + 1}`,
    subject: ["Mathematics", "Physics", "Chemistry", "English", "Biology", "History"][i],
  }));
  return (
    <>
      <PageHero title="Teachers & Staff" subtitle="Meet our dedicated educators" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((t) => (
          <article key={t.name} className="card text-center hover:scale-105 transition">
            <section className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-600 to-accent-teal mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {t.name[0]}
            </section>
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-accent-teal">{t.subject}</p>
          </article>
        ))}
      </section>
    </>
  );
}
