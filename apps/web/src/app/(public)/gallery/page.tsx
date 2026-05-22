import Image from "next/image";
import { PageHero } from "@/components/public/PageHero";

const images = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600",
  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa1?w=600",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
];

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Gallery" subtitle="Life at Marcelino Academy" />
      <section className="py-16 mx-auto max-w-7xl px-4 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <article key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
            <Image src={src} alt={`Gallery ${i + 1}`} fill className="object-cover group-hover:scale-110 transition duration-500" />
          </article>
        ))}
      </section>
    </>
  );
}
