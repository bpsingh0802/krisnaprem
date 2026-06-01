import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/sheets.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Krishna Prem Jyoti Trust" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const login = useServerFn(adminLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ data: { email, password } });
      localStorage.setItem("kpj_admin_token", res.token);
      toast.success("Welcome, Admin");
      navigate({ to: "/admin" });
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="min-h-[70vh] grid place-items-center py-16 px-4">
        <form onSubmit={onSubmit}
          className="w-full max-w-md rounded-3xl bg-card border border-border shadow-card p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-saffron grid place-items-center shadow-glow">
              <Lock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold">Admin Login</h1>
              <p className="text-sm text-muted-foreground">Krishna Prem Jyoti Trust</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="username" required value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="current-password" required value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading}
            className="w-full bg-gradient-saffron text-primary-foreground shadow-glow" size="lg">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
