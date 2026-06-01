import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import donationQr from "@/assets/donation-qr.jpeg";

export const Route = createFileRoute("/donation")({
  head: () => ({ meta: [
    { title: "Donate — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Donate via UPI by scanning our QR code. Every rupee fuels education and annadanam." },
  ]}),
  component: DonationPage,
});

const presets = [251, 501, 1100, 2100, 5100, 11000];

function DonationPage() {
  const [amount, setAmount] = useState<number | "">(1100);

  return (
    <SiteLayout>
      <PageHero eyebrow="Seva Daan" title="Donate with love"
        subtitle="Your contribution lights a lamp in a child's life. Scan the QR with any UPI app — every paise reaches them." />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
          {/* Amount selector */}
          <FadeIn>
            <div className="rounded-3xl bg-card border border-border p-8 shadow-card">
              <h3 className="font-display text-2xl font-semibold flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Choose your offering</h3>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {presets.map((p) => (
                  <button key={p} onClick={() => setAmount(p)}
                    className={`py-3 rounded-xl border text-sm font-semibold transition ${amount === p ? "border-primary bg-gradient-saffron text-primary-foreground shadow-glow" : "border-border hover:border-primary"}`}>
                    ₹{p.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <Label className="text-sm font-medium">Or enter custom amount (₹)</Label>
                <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1.5 text-lg" />
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Scan the QR code on the right with any UPI app (Google Pay, PhonePe, Paytm, BHIM) to contribute{" "}
                {amount ? <span className="font-semibold text-foreground">₹{Number(amount).toLocaleString("en-IN")}</span> : "your chosen amount"}.
              </p>
            </div>
          </FadeIn>

          {/* QR + Bank */}
          <FadeIn delay={0.1}>
            <div className="rounded-3xl bg-card border border-border p-6 text-center shadow-card">
              <div className="h-1 rounded-full bg-gradient-saffron" />
              <div className="mt-5 mx-auto w-full max-w-[320px] rounded-2xl overflow-hidden border border-border bg-white p-3">
                <img
                  src={donationQr}
                  alt="Krishna Prem Jyoti Trust UPI QR code"
                  className="w-full h-auto"
                  onClick={() => { toast.success("Scan with any UPI app to donate"); }}
                />
              </div>
              <p className="mt-4 text-sm font-medium">Scan to pay {amount ? `₹${Number(amount).toLocaleString("en-IN")}` : ""}</p>
              <p className="text-xs text-muted-foreground mt-1">Works with Google Pay, PhonePe, Paytm & all UPI apps</p>
            </div>

            <div className="mt-6 rounded-3xl bg-card border border-border p-6 shadow-card">
              <h4 className="font-display text-lg font-semibold flex items-center gap-2"><Heart className="h-4 w-4 text-primary" /> Bank Transfer / NEFT</h4>
              <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Account Name</dt><dd className="font-medium">Krishna Prem Jyoti Trust</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Bank</dt><dd className="font-medium">Axis Bank</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Branch</dt><dd className="font-medium">Sheeshganj, Chandni Chowk</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Account No.</dt><dd className="font-mono font-semibold">925010041963891</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">IFSC</dt><dd className="font-mono font-semibold">UTIB0005083</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">PAN</dt><dd className="font-mono font-semibold">AAGTK1781J</dd></div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Reg. No. 1684 · NGO Darpan: AAGTK1781JF20251</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </SiteLayout>
  );
}
