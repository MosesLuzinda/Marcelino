import { PageHero } from "@/components/public/PageHero";

export default function CoursesPage() {
  const courses = [
    { name: "Advanced Mathematics", code: "SUB1", credits: 3 },
    { name: "Physics Principles", code: "SUB2", credits: 3 },
    { name: "Organic Chemistry", code: "SUB3", credits: 3 },
    { name: "English Literature", code: "SUB4", credits: 3 },
    { name: "Biology", code: "SUB5", credits: 3 },
    { name: "Computer Science", code: "SUB7", credits: 4 },
  ];
  return (
    <>
      <PageHero title="Courses & Subjects" subtitle="Explore our academic offerings" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <article key={c.code} className="card hover:border-accent-teal/50 transition">
            <span className="text-xs font-mono text-accent-teal">{c.code}</span>
            <h3 className="font-semibold text-lg mt-1">{c.name}</h3>
            <p className="text-sm text-slate-500">{c.credits} credits</p>
          </article>
        ))}
      </section>
    </>
  );
}
