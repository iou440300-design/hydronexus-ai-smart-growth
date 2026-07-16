import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/app/Logo";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — HydroNexus AI" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (demo = false) => {
    setLoading(true);
    setTimeout(() => nav({ to: "/app" }), demo ? 400 : 900);
  };

  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-24 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: "var(--gold)" }} />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full blur-3xl opacity-20" style={{ background: "var(--primary-glow)" }} />
      </div>

      <div className="relative flex-1 flex flex-col justify-between px-6 pt-14 pb-6 max-w-md mx-auto w-full text-primary-foreground">
        <div className="animate-fade-up">
          <Logo size={56} />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome back.</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">Sign in to your HydroNexus farm.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          className="mt-8 glass rounded-3xl p-5 space-y-4 shadow-elegant animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <label className="block">
            <span className="text-xs uppercase tracking-wider font-medium text-primary-foreground/60">Email</span>
            <div className="mt-1.5 flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 h-12">
              <Mail className="h-4 w-4 opacity-70" />
              <input type="email" required defaultValue="farmer@agropulse.ng" className="flex-1 bg-transparent outline-none text-sm placeholder:text-primary-foreground/40" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider font-medium text-primary-foreground/60">Password</span>
            <div className="mt-1.5 flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 h-12">
              <Lock className="h-4 w-4 opacity-70" />
              <input type={show ? "text" : "password"} required defaultValue="hydronexus" className="flex-1 bg-transparent outline-none text-sm" />
              <button type="button" onClick={() => setShow((s) => !s)} className="opacity-70">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-primary-foreground/70">
              <input type="checkbox" defaultChecked className="accent-[var(--gold)]" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-gold font-medium">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-gold-gradient text-[var(--gold-foreground)] font-semibold shadow-gold-soft flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => submit(true)}
            className="w-full h-12 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition text-sm font-medium flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-gold" /> Try Demo Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-primary-foreground/70">
          New to HydroNexus?{" "}
          <Link to="/register" className="text-gold font-semibold">Create account</Link>
        </div>
      </div>
    </div>
  );
}
