import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-soft">
      <div className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.85 0.13 60 / 0.4), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.85 0.1 230 / 0.3), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        {eyebrow && <p className="text-xs font-semibold tracking-[0.3em] uppercase text-primary">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl md:text-6xl font-semibold text-gradient">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">{subtitle}</p>}
        <div className="ornate-divider mt-8 max-w-[120px] mx-auto" />
      </div>
    </section>
  );
}

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
