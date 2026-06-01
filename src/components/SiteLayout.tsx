import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun, Heart, MessageCircle, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo-lotus.png";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/members", label: "Members" },
  { to: "/admission", label: "Admission" },
  { to: "/donation", label: "Donate" },
  { to: "/feeding", label: "Feeding" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function SiteLayout({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Krishna Prem Jyoti Trust" className="h-10 w-10 lg:h-12 lg:w-12 group-hover:rotate-12 transition-transform" />
            <div className="leading-tight">
              <div className="font-display text-lg lg:text-xl font-semibold text-gradient">Krishna Prem Jyoti</div>
              <div className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-muted-foreground">Charitable Trust</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-md transition-colors relative"
                activeProps={{ className: "px-3 py-2 text-sm font-medium text-primary rounded-md" }}
                activeOptions={{ exact: n.to === "/" }}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-secondary transition-colors">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to="/donation" className="hidden sm:inline-flex">
              <Button className="bg-gradient-saffron text-primary-foreground shadow-glow hover:opacity-95 hover:scale-[1.02] transition">
                <Heart className="h-4 w-4 mr-1.5" /> Donate
              </Button>
            </Link>
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-secondary" aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background animate-[fade-up_0.2s_ease-out]">
            <div className="px-4 py-3 grid gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                  activeProps={{ className: "px-3 py-2.5 rounded-lg bg-secondary text-primary text-sm font-semibold" }}
                  activeOptions={{ exact: n.to === "/" }}>
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children ?? <Outlet />}
      </main>

      <footer className="mt-20 border-t border-border bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="h-10 w-10" />
              <span className="font-display text-xl font-semibold text-gradient">Krishna Prem Jyoti Trust</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
              Serving humanity through education, nourishment, and spiritual upliftment. Together, we light the lamp of knowledge for generations to come.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: Instagram, href: "https://shorturl.at/2adcU" },
                { Icon: Facebook, href: "https://shorturl.at/wdEFc" },
                { Icon: Youtube, href: "https://shorturl.at/4Oa4e" },
                { Icon: MessageCircle, href: "https://wa.me/917303222863" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="p-2.5 rounded-full bg-card border border-border hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all shadow-card">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-5 text-xs text-muted-foreground space-y-1">
              <p>Reg. No.: <span className="text-foreground">1684</span> · PAN: <span className="text-foreground">AAGTK1781J</span></p>
              <p>NGO Darpan: <span className="text-foreground">AAGTK1781JF20251</span></p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {nav.slice(1, 6).map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-primary transition-colors">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Reach Us</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> 206, Third Floor, Behind Gurudwara Band Gali, Near Monu Boot House, Teliwara, Shahdara, Delhi – 110032</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 73032 22863</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> krishnapremjyotitrust@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Krishna Prem Jyoti Trust. Reg. Charitable Organization.</p>
            <div className="flex items-center gap-4">
              <Link to="/admin/login" className="hover:text-primary transition-colors">Admin</Link>
              <p className="font-display italic">"सर्वे भवन्तु सुखिनः"</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/917303222863" target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
        <div className="relative h-14 w-14 rounded-full bg-green-500 text-white grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
          <MessageCircle className="h-6 w-6" />
        </div>
      </a>
    </div>
  );
}
