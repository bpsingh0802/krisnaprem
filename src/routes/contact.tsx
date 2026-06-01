import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Reach Krishna Prem Jyoti Trust via WhatsApp, email, or visit us in Vrindavan." },
  ]}),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  return (
    <SiteLayout>
      <PageHero eyebrow="Get in Touch" title="We'd love to hear from you"
        subtitle="Questions, partnerships, or simply hello — we read every message." />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6">
          <FadeIn className="lg:col-span-1">
            <div className="space-y-4">
              {[
                { Icon: MapPin, title: "Visit Us", body: "206, Third Floor, Behind Gurudwara Band Gali, Near Monu Boot House, Teliwara, Shahdara, Delhi – 110032" },
                { Icon: Phone, title: "Call", body: "+91 73032 22863" },
                { Icon: Mail, title: "Email", body: "krishnapremjyotitrust@gmail.com" },
              ].map((c) => (
                <div key={c.title} className="rounded-2xl bg-card border border-border p-5 shadow-card flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-gradient-saffron grid place-items-center text-primary-foreground shrink-0"><c.Icon className="h-5 w-5" /></div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary font-semibold">{c.title}</div>
                    <div className="text-sm mt-1">{c.body}</div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-card border border-border p-5 shadow-card">
                <div className="text-xs uppercase tracking-wider text-primary font-semibold">Follow</div>
                <div className="mt-3 flex gap-2">
                  {[
                    { I: Instagram, href: "https://shorturl.at/2adcU" },
                    { I: Facebook, href: "https://shorturl.at/wdEFc" },
                    { I: Youtube, href: "https://shorturl.at/4Oa4e" },
                    { I: MessageCircle, href: "https://wa.me/917303222863" },
                  ].map(({ I, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noreferrer" className="p-2.5 rounded-full bg-secondary hover:bg-gradient-saffron hover:text-primary-foreground transition-all"><I className="h-4 w-4" /></a>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-2">
            <form onSubmit={(e) => { e.preventDefault(); setSending(true); setTimeout(() => { setSending(false); toast.success("Message sent. Hari Bol!"); (e.target as HTMLFormElement).reset(); }, 700); }}
              className="rounded-3xl bg-card border border-border p-8 shadow-card">
              <h3 className="font-display text-2xl font-semibold">Send a message</h3>
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div><Label>Name</Label><Input required className="mt-1.5" /></div>
                <div><Label>Email</Label><Input required type="email" className="mt-1.5" /></div>
                <div className="sm:col-span-2"><Label>Subject</Label><Input required className="mt-1.5" /></div>
                <div className="sm:col-span-2"><Label>Message</Label><Textarea required rows={5} className="mt-1.5" /></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="submit" disabled={sending} className="bg-gradient-saffron text-primary-foreground shadow-glow">
                  <Send className="h-4 w-4 mr-2" /> {sending ? "Sending…" : "Send Message"}
                </Button>
                <a href="https://wa.me/917303222863" target="_blank" rel="noreferrer">
                  <Button type="button" variant="outline" className="border-green-500/40 text-green-700 dark:text-green-400 hover:bg-green-500/10">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Us
                  </Button>
                </a>
              </div>
            </form>

            <div className="mt-6 rounded-3xl overflow-hidden border border-border shadow-card">
              <iframe
                title="Map"
                src="https://www.google.com/maps?q=Teliwara+Shahdara+Delhi+110032&output=embed"
                width="100%" height="320" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </FadeIn>
        </div>
      </section>
    </SiteLayout>
  );
}
