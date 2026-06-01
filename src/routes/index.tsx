import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, GraduationCap, UtensilsCrossed, Sparkles, ArrowRight, Users, BookOpen, Calendar } from "lucide-react";
import hero from "@/assets/hero-temple.jpg";
import students from "@/assets/students.jpg";
import feeding from "@/assets/feeding.jpg";
import { SiteLayout } from "@/components/SiteLayout";
import { FadeIn } from "@/components/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krishna Prem Jyoti Trust — Krishna Ka Prem, Jeevan Ki Jyoti" },
      { name: "description", content: "Krishna Prem Jyoti Trust is a dedicated organization working towards empowering and supporting visually impaired individuals with love, dignity, and compassion. Our mission is to spread hope, independence, and opportunities through education, care, guidance, and community support. We believe that true vision comes not from the eyes, but from courage, confidence, and the light of humanity. Through selfless service and kindness, we strive to bring positivity and a brighter future into every life we touch." },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "12K+", label: "Meals Served" },
  { value: "850+", label: "Students Helped" },
  { value: "120+", label: "Volunteers" },
  { value: "25+", label: "Festivals Celebrated" },
];

const updates = [
  { date: "May 08", title: "Annadanam at Vrindavan Pathshala", body: "Over 400 students were served a sattvic meal during our weekly annadanam." },
  { date: "Apr 22", title: "New Scholarships Announced", body: "We awarded full scholarships to 24 deserving students from underprivileged families." },
  { date: "Apr 14", title: "Vaishakhi Celebration", body: "Community gathered to celebrate harvest, gratitude, and the spirit of giving." },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Temple at sunrise" className="w-full h-full object-cover" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur border border-gold/40 text-xs font-semibold tracking-wider uppercase text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Seva Since 2025
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-[1.05]">
              Light the lamp of <span className="text-gradient">knowledge</span> & nourish a soul
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Krishna Prem Jyoti Trust is a community of seekers serving students, the hungry, and the spiritually devoted — through education, annadanam, and selfless love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/donation">
                <Button size="lg" className="bg-gradient-saffron text-primary-foreground shadow-glow hover:scale-[1.02] transition">
                  <Heart className="h-4 w-4 mr-2" /> Donate Now
                </Button>
              </Link>
              <Link to="/admission">
                <Button size="lg" variant="outline" className="border-gold/50 hover:bg-gold/10">
                  <GraduationCap className="h-4 w-4 mr-2" /> Apply for Admission
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-semibold text-gradient">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-hidden shadow-glow border-4 border-card animate-float">
              <img src={students} alt="Students" className="w-full h-[520px] object-cover" loading="lazy" width={1280} height={896} />
              <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur rounded-2xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-saffron grid place-items-center">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sponsor a Student</div>
                    <div className="text-xs text-muted-foreground">₹500/month gives books, uniforms & meals</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">Our Purpose</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">A vision rooted in compassion</h2>
            <div className="ornate-divider mt-6 max-w-[100px] mx-auto" />
          </FadeIn>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { Icon: GraduationCap, title: "Education for All", body: "Free schooling, scholarships, books and uniforms for children in need.", tint: "saffron" },
              { Icon: UtensilsCrossed, title: "Annadanam Seva", body: "Daily nourishing meals served to students, sadhus, and the hungry.", tint: "gold" },
              { Icon: Heart, title: "Spiritual Upliftment", body: "Bhajan sandhya, festivals, and satsang to nurture every soul.", tint: "sky" },
            ].map((c, i) => (
              <FadeIn key={c.title} delay={i * 0.1}>
                <div className="group relative h-full rounded-3xl bg-card border border-border p-8 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <div className="h-14 w-14 rounded-2xl bg-gradient-saffron grid place-items-center text-primary-foreground shadow-glow group-hover:scale-110 transition-transform">
                    <c.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold">{c.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{c.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT WELFARE STRIP */}
      <section className="py-16 bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="rounded-3xl overflow-hidden shadow-soft">
              <img src={feeding} alt="Feeding event" className="w-full h-[420px] object-cover" loading="lazy" width={1280} height={896} />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">Student Welfare</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold">Every meal is a blessing. Every book, a future.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our welfare programs support hundreds of children with mid-day meals, school supplies, mentoring, and medical care — ensuring no child is left behind.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[
                { Icon: UtensilsCrossed, t: "Mid-day Meals", v: "Daily" },
                { Icon: BookOpen, t: "Free Books", v: "All grades" },
                { Icon: Users, t: "Mentorship", v: "1-on-1" },
                { Icon: Heart, t: "Health Camps", v: "Monthly" },
              ].map((x) => (
                <div key={x.t} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center text-accent-foreground"><x.Icon className="h-5 w-5" /></div>
                  <div>
                    <div className="text-sm font-semibold">{x.t}</div>
                    <div className="text-xs text-muted-foreground">{x.v}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/feeding" className="inline-flex items-center gap-1 mt-6 text-primary font-semibold hover:gap-2 transition-all">
              Sponsor a meal <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* LATEST UPDATES */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">News & Events</p>
              <h2 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Latest from the Trust</h2>
            </div>
            <Link to="/gallery" className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {updates.map((u, i) => (
              <FadeIn key={u.title} delay={i * 0.08}>
                <article className="h-full rounded-3xl bg-card border border-border p-8 shadow-card hover:border-gold transition-colors group">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                    <Calendar className="h-3.5 w-3.5" /> {u.date}, 2026
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold group-hover:text-primary transition-colors">{u.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{u.body}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-divine p-10 md:p-16 text-center shadow-glow">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 50%)" }} />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground">Be the reason a child smiles tomorrow</h2>
              <p className="mt-4 text-primary-foreground/90 max-w-xl mx-auto">Your seva — small or large — fuels education, nourishment, and hope.</p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Link to="/donation"><Button size="lg" variant="secondary" className="shadow-card">Donate Now</Button></Link>
                <Link to="/feeding"><Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">Book a Feeding Slot</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
