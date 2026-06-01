import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";

export const Route = createFileRoute("/members")({
  head: () => ({ meta: [
    { title: "Members & Team — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Meet the founder, trustees, and volunteers who make Krishna Prem Jyoti Trust possible." },
  ]}),
  component: MembersPage,
});

const members = [
  { name: "Kunal Singh", role: "President", initial: "K" },
  { name: "Yogesh Kumar", role: "Manager", initial: "Y" },
];

function MembersPage() {
  return (
    <SiteLayout>
      <PageHero eyebrow="Our Family" title="The hands & hearts of seva"
        subtitle="A community of trustees, mentors, and volunteers — bound by the love for service." />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.05}>
              <div className="group relative rounded-3xl bg-card border border-border p-6 text-center shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-saffron grid place-items-center text-primary-foreground font-display text-4xl shadow-glow group-hover:scale-110 transition-transform">
                  {m.initial}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{m.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-primary">{m.role}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
