import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { LogOut, RefreshCw, GraduationCap, UtensilsCrossed, Heart, Ban, XCircle, CalendarX } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAdmissions, getFeedings, getDonations, adminUpdateMealStatus, adminBlockDate } from "@/lib/sheets.functions";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Krishna Prem Jyoti Trust" }] }),
  component: AdminDashboard,
});

type Row = Record<string, string | number>;

function fmtDate(s: string) {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function AdminDashboard() {
  const navigate = useNavigate();
  const fetchAdm = useServerFn(getAdmissions);
  const fetchFeed = useServerFn(getFeedings);
  const fetchDon = useServerFn(getDonations);

  const [token, setToken] = useState<string | null>(null);
  const [admissions, setAdmissions] = useState<Row[]>([]);
  const [feedings, setFeedings] = useState<Row[]>([]);
  const [donations, setDonations] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("kpj_admin_token") : null;
    if (!t) {
      navigate({ to: "/admin/login" });
      return;
    }
    setToken(t);
  }, [navigate]);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    try {
      const [a, f, d] = await Promise.all([
        fetchAdm({ data: { token: t } }),
        fetchFeed({ data: { token: t } }),
        fetchDon({ data: { token: t } }),
      ]);
      setAdmissions(a);
      setFeedings(f);
      setDonations(d);
    } catch {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("kpj_admin_token");
      navigate({ to: "/admin/login" });
    } finally {
      setLoading(false);
    }
  }, [fetchAdm, fetchFeed, fetchDon, navigate]);

  useEffect(() => { if (token) load(token); }, [token, load]);

  if (!token) return null;

  const totalDonations = donations.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  function logout() {
    localStorage.removeItem("kpj_admin_token");
    navigate({ to: "/admin/login" });
  }

  return (
    <SiteLayout>
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Live records from Google Sheets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => token && load(token)} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Admissions" value={admissions.length} />
          <StatCard icon={<UtensilsCrossed className="h-5 w-5" />} label="Feeding Bookings" value={feedings.length} />
          <StatCard icon={<Heart className="h-5 w-5" />} label="Donations (₹)"
            value={totalDonations.toLocaleString("en-IN")} sub={`${donations.length} payments`} />
        </div>

        <Tabs defaultValue="admissions" className="mt-8">
          <TabsList>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="feeding">Feeding</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="admissions">
            <DataTable
              columns={["Date","Student","Age","Gender","Blood","Mobile","Aadhaar","Address","Father","Mother","Income","Caste","Class","Qualification","School","Disability","Blind","Disability Details","Guardian","Emergency"]}
              rows={admissions.map((r) => [
                fmtDate(String(r.timestamp)), r.studentName, r.age, r.gender, r.bloodGroup,
                r.mobile, r.aadhaar, r.address, r.fatherName, r.motherName,
                r.familyIncome, r.casteCategory, r.studentClass, r.qualification, r.schoolName,
                r.disabilityStatus, r.isBlind, r.disabilityDetails, r.guardianName, r.emergencyContact,
              ])}
              empty="No admissions yet."
            />
          </TabsContent>

          <TabsContent value="feeding">
            <FeedingPanel
              rows={feedings}
              token={token}
              onChanged={() => token && load(token)}
            />
          </TabsContent>

          <TabsContent value="donations">
            <DataTable
              columns={["Date", "Donor", "Mobile", "Amount (₹)", "Note"]}
              rows={donations.map((r) => [
                fmtDate(String(r.timestamp)), r.donorName, r.mobile,
                Number(r.amount || 0).toLocaleString("en-IN"), r.note,
              ])}
              empty="No donations recorded yet."
            />
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon} {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-display text-3xl font-semibold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function DataTable({ columns, rows, empty }: { columns: string[]; rows: (string | number)[][]; empty: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-card overflow-x-auto shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => <TableHead key={c}>{c}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground py-10">{empty}</TableCell></TableRow>
          ) : rows.map((r, i) => (
            <TableRow key={i}>
              {r.map((cell, j) => <TableCell key={j} className="whitespace-pre-wrap">{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const MEALS = ["breakfast", "lunch", "dinner"] as const;
type Meal = (typeof MEALS)[number];

function FeedingPanel({ rows, token, onChanged }: { rows: Row[]; token: string | null; onChanged: () => void }) {
  const updateMeal = useServerFn(adminUpdateMealStatus);
  const blockDate = useServerFn(adminBlockDate);
  const [blockDateInput, setBlockDateInput] = useState("");
  const [busy, setBusy] = useState(false);

  // Aggregate latest status per (date,meal)
  const latest = new Map<string, Row>();
  for (const r of rows) {
    const key = `${r.date}|${String(r.meal).toLowerCase()}`;
    latest.set(key, r); // later rows overwrite earlier — newest status wins
  }

  // Analytics
  const totalBookings = [...latest.values()].filter((r) => r.status === "Booked").length;
  const blocked = [...latest.values()].filter((r) => r.status === "Blocked").length;
  const cancelled = [...latest.values()].filter((r) => r.status === "Cancelled").length;
  const totalAmount = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  const setStatus = async (date: string, meal: Meal, action: "Cancelled" | "Blocked" | "Available") => {
    if (!token) return;
    setBusy(true);
    try {
      await updateMeal({ data: { token, date, meal, action, note: "" } });
      toast.success(`${meal} on ${date} → ${action}`);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally { setBusy(false); }
  };

  const doBlockDate = async () => {
    if (!token || !blockDateInput) return;
    setBusy(true);
    try {
      await blockDate({ data: { token, date: blockDateInput, note: "Reserved" } });
      toast.success(`Blocked all meals on ${blockDateInput}`);
      setBlockDateInput("");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Block failed");
    } finally { setBusy(false); }
  };

  // Sort rows newest first
  const sorted = [...rows].sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

  return (
    <div className="mt-4 space-y-4">
      {/* Analytics */}
      <div className="grid sm:grid-cols-4 gap-3">
        <MiniStat label="Booked slots" value={totalBookings} />
        <MiniStat label="Blocked slots" value={blocked} />
        <MiniStat label="Cancelled" value={cancelled} />
        <MiniStat label="Total raised (₹)" value={totalAmount.toLocaleString("en-IN")} />
      </div>

      {/* Block a date */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><CalendarX className="h-4 w-4" /> Block / Reserve a Date</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap items-end gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Date (YYYY-MM-DD)</label>
            <Input type="date" value={blockDateInput} onChange={(e) => setBlockDateInput(e.target.value)} className="mt-1 w-48" />
          </div>
          <Button onClick={doBlockDate} disabled={busy || !blockDateInput} variant="secondary">
            <Ban className="h-4 w-4" /> Block all meals
          </Button>
        </CardContent>
      </Card>

      {/* Bookings table */}
      <div className="rounded-2xl border border-border bg-card overflow-x-auto shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              {["When", "Donor", "Mobile", "Email", "Date", "Meal", "Occasion", "₹", "Status", "Actions"].map((c) => <TableHead key={c}>{c}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-10">No feeding bookings yet.</TableCell></TableRow>
            ) : sorted.map((r, i) => {
              const status = String(r.status || "Booked");
              const meal = String(r.meal).toLowerCase() as Meal;
              const key = `${r.date}|${meal}`;
              const isLatest = latest.get(key) === r;
              return (
                <TableRow key={i}>
                  <TableCell className="text-xs">{fmtDate(String(r.timestamp))}</TableCell>
                  <TableCell>{r.donorName}</TableCell>
                  <TableCell>{r.mobile}</TableCell>
                  <TableCell className="text-xs">{r.email}</TableCell>
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell className="capitalize">{r.meal}</TableCell>
                  <TableCell className="text-xs">{r.occasion}</TableCell>
                  <TableCell>{r.amount ? Number(r.amount).toLocaleString("en-IN") : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={status === "Booked" ? "default" : status === "Blocked" ? "secondary" : "outline"} className={
                      status === "Cancelled" ? "text-destructive border-destructive/40" : ""
                    }>{status}</Badge>
                  </TableCell>
                  <TableCell>
                    {isLatest && status === "Booked" && MEALS.includes(meal) && (
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus(String(r.date), meal, "Cancelled")}>
                        <XCircle className="h-3.5 w-3.5" /> Cancel
                      </Button>
                    )}
                    {isLatest && status === "Blocked" && (
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus(String(r.date), meal, "Available")}>
                        Unblock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
