import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";
import { Quote } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Established 2025. Krishna Prem Jyoti Trust empowers visually impaired individuals with education, care, and dignity." },
  ]}),
  component: AboutPage,
});

const objectives = [
  "Provide educational and skill development opportunities for visually impaired individuals.",
  "Promote independence, confidence, and self-reliance among beneficiaries.",
  "Organize awareness programs for creating an inclusive society.",
  "Offer emotional, social, and community support to blind and visually impaired people.",
  "Assist with healthcare, rehabilitation, and accessibility resources whenever possible.",
  "Encourage employment and livelihood opportunities for differently-abled individuals.",
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Established 2025"
        title="Light beyond sight"
        subtitle="Krishna Prem Jyoti Trust empowers visually impaired individuals with love, dignity, and compassion."
      />

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-xl leading-relaxed text-foreground/90">
              Krishna Prem Jyoti Trust is a dedicated organization working towards empowering and supporting visually impaired individuals with love, dignity, and compassion. Our mission is to spread hope, independence, and opportunities through education, care, guidance, and community support.
            </p>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              We believe that true vision comes not from the eyes, but from courage, confidence, and the light of humanity. Through selfless service and kindness, we strive to bring positivity and a brighter future into every life we touch.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
          <FadeIn>
            <div className="h-full rounded-3xl bg-card border border-border p-10 shadow-card">
              <h3 className="font-display text-3xl font-semibold text-gradient">Our Mission</h3>
              <div className="ornate-divider mt-4 max-w-[80px]" />
              <p className="mt-5 text-muted-foreground leading-relaxed">
                To empower visually impaired individuals by providing support, education, care, and equal opportunities, while promoting dignity, independence, and social inclusion through compassion and selfless service.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="h-full rounded-3xl bg-card border border-border p-10 shadow-card">
              <h3 className="font-display text-3xl font-semibold text-gradient">Our Vision</h3>
              <div className="ornate-divider mt-4 max-w-[80px]" />
              <p className="mt-5 text-muted-foreground leading-relaxed">
                To build an inclusive and compassionate society where visually impaired individuals can live with confidence, respect, independence, and equal opportunities, illuminated by hope and humanity.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">What we do</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Our Objectives</h2>
            <div className="ornate-divider mt-6 max-w-[120px] mx-auto" />
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((o, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="h-full rounded-2xl bg-card border border-border p-6 shadow-card flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-saffron flex items-center justify-center text-primary-foreground font-display font-semibold shadow-glow">
                    {i + 1}
                  </div>
                  <p className="text-foreground/90 leading-relaxed">{o}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative rounded-3xl bg-gradient-divine p-10 md:p-14 text-center text-primary-foreground shadow-glow">
              <Quote className="h-10 w-10 mx-auto opacity-60" />
              <p className="mt-6 font-display text-2xl md:text-3xl italic leading-relaxed">
                "True vision comes not from the eyes, but from courage, confidence, and the light of humanity."
              </p>
              <p className="mt-6 text-sm uppercase tracking-[0.3em] opacity-80">— Krishna Prem Jyoti Trust</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </SiteLayout>
  );
}
