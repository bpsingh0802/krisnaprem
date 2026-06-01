import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";
import students from "@/assets/students.jpg";
import feeding from "@/assets/feeding.jpg";
import temple from "@/assets/hero-temple.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "Gallery — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Photos and videos from our events, festivals, annadanam, and student activities." },
  ]}),
  component: GalleryPage,
});

const items = [
  { src: students, title: "Pathshala Students", cat: "Students" },
  { src: feeding, title: "Annadanam Day", cat: "Annadanam" },
  { src: temple, title: "Diya Festival", cat: "Festival" },
  { src: students, title: "Book Distribution", cat: "Welfare" },
  { src: feeding, title: "Community Lunch", cat: "Annadanam" },
  { src: temple, title: "Morning Aarti", cat: "Festival" },
];

function GalleryPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <SiteLayout>
      <PageHero eyebrow="Memories" title="Moments of grace"
        subtitle="A glimpse into our events, celebrations, and the joy of seva." />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <button onClick={() => setOpen(item.src)} className="group block relative w-full overflow-hidden rounded-3xl shadow-card hover:shadow-glow transition-all">
                <img src={item.src} alt={item.title} className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-5 text-left text-background">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">{item.cat}</p>
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-[60] bg-foreground/90 backdrop-blur grid place-items-center p-4 animate-[fade-up_0.2s_ease-out]" onClick={() => setOpen(null)}>
          <button className="absolute top-6 right-6 p-2 rounded-full bg-card text-foreground" onClick={() => setOpen(null)}><X className="h-5 w-5" /></button>
          <img src={open} alt="" className="max-h-[90vh] max-w-[95vw] rounded-2xl shadow-glow" />
        </div>
      )}
    </SiteLayout>
  );
}
