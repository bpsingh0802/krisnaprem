import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, UtensilsCrossed, Sun, Moon, Coffee, CheckCircle2, Ban } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useServerFn } from "@tanstack/react-start";
import { submitFeeding, getMealAvailability } from "@/lib/sheets.functions";

export const Route = createFileRoute("/feeding")({
  head: () => ({ meta: [
    { title: "Feeding Slot Booking — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Sponsor a meal — book breakfast, lunch, or dinner for our students." },
  ]}),
  component: FeedingPage,
});

type Meal = "breakfast" | "lunch" | "dinner";
const meals: { id: Meal; label: string; Icon: typeof Sun; price: number }[] = [
  { id: "breakfast", label: "Breakfast", Icon: Coffee, price: 2100 },
  { id: "lunch", label: "Lunch", Icon: Sun, price: 5100 },
  { id: "dinner", label: "Dinner", Icon: Moon, price: 3100 },
];

type StatusMap = Record<string, Record<Meal, string>>;

function fmt(d: Date) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function bookedMeals(s: Record<Meal, string> | undefined): Meal[] {
  if (!s) return [];
  return (Object.keys(s) as Meal[]).filter((m) => s[m] === "Booked" || s[m] === "Blocked");
}

function FeedingPage() {
  const today = new Date();
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [confirmed, setConfirmed] = useState<{ date: string; meal: Meal } | null>(null);
  const [busy, setBusy] = useState(false);

  const submitFn = useServerFn(submitFeeding);
  const fetchAvail = useServerFn(getMealAvailability);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchAvail();
      setStatusMap(data as StatusMap);
    } catch (e) { console.error(e); }
  }, [fetchAvail]);

  useEffect(() => { refresh(); }, [refresh]);

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const last = new Date(view.getFullYear(), view.getMonth() + 1, 0);
    const arr: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= last.getDate(); d++) arr.push(new Date(view.getFullYear(), view.getMonth(), d));
    return arr;
  }, [view]);

  const getMealStatus = (date: string, m: Meal): "Booked" | "Blocked" | "Available" => {
    const s = statusMap[date]?.[m];
    if (s === "Booked" || s === "Blocked") return s;
    return "Available";
  };

  const dayState = (date: string): "available" | "partial" | "full" => {
    const booked = bookedMeals(statusMap[date]).length;
    if (booked === 0) return "available";
    if (booked >= 3) return "full";
    return "partial";
  };

  const submit = async () => {
    if (!selected || !meal) return toast.error("Pick a date and meal");
    if (getMealStatus(selected, meal) !== "Available") return toast.error("That slot is no longer available");
    if (!name.trim()) return toast.error("Please enter your name");
    if (!mobile.trim() || mobile.trim().length < 10) return toast.error("Enter a valid mobile number");
    if ((meal === "lunch" || meal === "dinner") && !occasion) return toast.error("Please select a food type");
    setBusy(true);
    try {
      await submitFn({ data: { donorName: name, mobile, email, date: selected, meal, occasion, amount: Number(amount) || 0, message: "" } });
      setConfirmed({ date: selected, meal });
      toast.success("Slot booked with gratitude!");
      setSelected(null); setMeal(null);
      setName(""); setMobile(""); setEmail(""); setOccasion(""); setAmount(0);
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Booking failed");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const monthName = view.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const todayKey = fmt(new Date(today.toDateString()));

  return (
    <SiteLayout>
      <PageHero eyebrow="Annadanam · Feeding Seva" title="Sponsor a meal, feed a soul"
        subtitle="Click any date to see availability for breakfast, lunch and dinner." />

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-card">
              <div className="flex items-center justify-between">
                <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-secondary" aria-label="Previous month"><ChevronLeft className="h-5 w-5" /></button>
                <h3 className="font-display text-2xl font-semibold">{monthName}</h3>
                <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-secondary" aria-label="Next month"><ChevronRight className="h-5 w-5" /></button>
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1.5 text-center text-xs uppercase tracking-wider text-muted-foreground">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="py-1">{d}</div>)}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1.5">
                {days.map((d, i) => {
                  if (!d) return <div key={i} />;
                  const k = fmt(d);
                  const past = k < todayKey;
                  const state = dayState(k);
                  const colorCls =
                    past ? "bg-muted/40 text-muted-foreground/40 cursor-not-allowed" :
                    state === "full" ? "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/40 hover:bg-red-500/20" :
                    state === "partial" ? "bg-yellow-400/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/40 hover:bg-yellow-400/25" :
                    "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/40 hover:bg-green-500/20";
                  return (
                    <button key={i} disabled={past}
                      onClick={() => { setSelected(k); setMeal(null); }}
                      className={`aspect-square rounded-xl border text-sm font-semibold transition flex flex-col items-center justify-center ${colorCls}`}>
                      <span>{d.getDate()}</span>
                      {!past && state !== "available" && (
                        <span className="text-[9px] font-medium uppercase tracking-wide opacity-80 mt-0.5">
                          {state === "full" ? "Full" : "Partial"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-xs">
                <Legend color="bg-green-500" label="Available" />
                <Legend color="bg-yellow-400" label="Partially Booked" />
                <Legend color="bg-red-500" label="Fully Booked" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Date detail / booking modal */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setMeal(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selected && (() => {
            const dateLabel = new Date(selected).toLocaleDateString("en-IN", { dateStyle: "full" });
            const state = dayState(selected);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{dateLabel}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2">
                    Status:
                    <Badge variant={state === "full" ? "destructive" : "secondary"} className={
                      state === "available" ? "bg-green-500/15 text-green-700 dark:text-green-400" :
                      state === "partial" ? "bg-yellow-400/15 text-yellow-700 dark:text-yellow-500" : ""
                    }>
                      {state === "full" ? "Fully Booked" : state === "partial" ? "Partially Booked" : "Available"}
                    </Badge>
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {meals.map((m) => {
                    const s = getMealStatus(selected, m.id);
                    const active = meal === m.id;
                    const disabled = s !== "Available";
                    return (
                      <button key={m.id} disabled={disabled} onClick={() => { setMeal(m.id); setOccasion(""); }}
                        className={`p-3 rounded-xl border text-left transition
                          ${active ? "border-primary bg-gradient-saffron text-primary-foreground shadow-glow" : "border-border"}
                          ${disabled ? "opacity-50 cursor-not-allowed bg-muted/30" : "hover:border-primary"}`}>
                        <div className="flex items-center justify-between">
                          <m.Icon className="h-4 w-4" />
                          {disabled && <Ban className="h-3.5 w-3.5" />}
                        </div>
                        <div className="font-semibold text-sm mt-2">{m.label}</div>
                        <div className={`text-[11px] mt-0.5 ${active ? "text-primary-foreground/80" : disabled ? "text-destructive" : "text-muted-foreground"}`}>
                          {s === "Booked" ? "Booked" : s === "Blocked" ? "Blocked" : `₹${m.price}`}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {meal ? (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Full Name *"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></Field>
                      <Field label="Mobile *"><Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit" maxLength={15} /></Field>
                    </div>
                    <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
                    {(meal === "lunch" || meal === "dinner") && (
                      <Field label="Food Type *">
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { id: "Normal", items: ["Roti", "Chawal", "Aloo Gobi", "Raita"] },
                            { id: "Special", items: ["Matar Paneer", "Dal Chawal", "Rasgulla", "Raita", "Papad"] },
                          ] as const).map((opt) => {
                            const active = occasion.startsWith(opt.id);
                            return (
                              <button type="button" key={opt.id}
                                onClick={() => setOccasion(`${opt.id}: ${opt.items.join(", ")}`)}
                                className={`p-3 rounded-xl border text-left transition ${active ? "border-primary bg-gradient-saffron text-primary-foreground shadow-glow" : "border-border hover:border-primary"}`}>
                                <div className="font-semibold text-sm">{opt.id}</div>
                                <ul className={`text-[11px] mt-1 space-y-0.5 ${active ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                                  {opt.items.map((i) => <li key={i}>• {i}</li>)}
                                </ul>
                              </button>
                            );
                          })}
                        </div>
                      </Field>
                    )}
                    <Field label="Optional Donation Amount (₹)"><Input type="number" min={0} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} placeholder="0" /></Field>
                    <Button onClick={submit} disabled={busy} size="lg" className="w-full bg-gradient-saffron text-primary-foreground shadow-glow">
                      <UtensilsCrossed className="h-4 w-4" /> {busy ? "Booking…" : `Confirm ${meal.charAt(0).toUpperCase() + meal.slice(1)} Booking`}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {state === "full" ? "All meals are booked for this date." : "Select an available meal above to continue."}
                  </p>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Thank you modal */}
      <Dialog open={!!confirmed} onOpenChange={(o) => { if (!o) setConfirmed(null); }}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <CheckCircle2 className="h-14 w-14 mx-auto text-primary" />
            <DialogTitle className="font-display text-2xl mt-2">Booking Confirmed</DialogTitle>
            <DialogDescription>
              {confirmed && <>You have sponsored <strong className="text-foreground capitalize">{confirmed.meal}</strong> on <strong className="text-foreground">{new Date(confirmed.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</strong>.</>}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-1.5 text-muted-foreground"><span className={`h-3 w-3 rounded-full ${color}`} /> {label}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</Label><div className="mt-1">{children}</div></div>;
}
