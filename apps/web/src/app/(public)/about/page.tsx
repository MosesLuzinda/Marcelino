import { PageHero } from "@/components/public/PageHero";

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" subtitle="Excellence Through Education since 1998" />
      <section className="py-16 mx-auto max-w-4xl px-4 lg:px-8 prose dark:prose-invert">
        <p>Marcelino International Academy is a premier educational institution in Uganda, dedicated to nurturing academic excellence, character, and global citizenship.</p>
        <h2>Our Mission</h2>
        <p>To provide world-class education that empowers students to achieve their full potential and contribute meaningfully to society.</p>
        <h2>Our Vision</h2>
        <p>To be the leading school in East Africa, recognized for academic excellence, innovation, and holistic student development.</p>
        <h2>Core Values</h2>
        <ul>
          <li><strong>Excellence</strong> — Striving for the highest standards in all we do</li>
          <li><strong>Integrity</strong> — Acting with honesty and ethical principles</li>
          <li><strong>Innovation</strong> — Embracing technology and modern teaching methods</li>
          <li><strong>Community</strong> — Building strong partnerships with families and society</li>
        </ul>
      </section>
    </>
  );
}
