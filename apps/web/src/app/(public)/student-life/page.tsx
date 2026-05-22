import { PageHero } from "@/components/public/PageHero";

export default function StudentLifePage() {
  return (
    <>
      <PageHero title="Student Life" subtitle="Beyond the classroom" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {["Sports & Athletics", "Arts & Music", "Clubs & Societies", "Community Service"].map((item) => (
          <article key={item} className="card text-center">
            <span className="text-4xl mb-4 block">🎯</span>
            <h3 className="font-semibold">{item}</h3>
            <p className="text-sm text-slate-500 mt-2">Engaging activities that develop well-rounded individuals.</p>
          </article>
        ))}
      </section>
    </>
  );
}
