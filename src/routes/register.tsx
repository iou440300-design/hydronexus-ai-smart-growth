import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/app/Logo";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — HydroNexus AI" }] }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <div className="relative flex-1 flex flex-col px-6 pt-12 pb-6 max-w-md mx-auto w-full text-primary-foreground">
        <Logo size={48} />
        <h1 className="mt-6 text-3xl font-bold">Create your farm.</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">A minute to set up. A lifetime of yield.</p>

        <form
          onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => nav({ to: "/app" }), 900); }}
          className="mt-8 glass rounded-3xl p-5 space-y-3 shadow-elegant"
        >
          {[
            { icon: User, ph: "Full name", type: "text" },
            { icon: Mail, ph: "Email address", type: "email" },
            { icon: Phone, ph: "Phone (Nigeria)", type: "tel" },
            { icon: Lock, ph: "Password", type: "password" },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 h-12">
                <Icon className="h-4 w-4 opacity-70" />
                <input type={f.type} required placeholder={f.ph} className="flex-1 bg-transparent outline-none text-sm placeholder:text-primary-foreground/40" />
              </div>
            );
          })}
          <button disabled={loading} className="mt-2 w-full h-12 rounded-2xl bg-gold-gradient text-[var(--gold-foreground)] font-semibold shadow-gold-soft flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? "Creating..." : "Create account"} <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-[11px] text-primary-foreground/60 text-center pt-1">
            By continuing you agree to AgroPulse Terms &amp; Privacy.
          </p>
        </form>

        <div className="mt-6 text-center text-sm text-primary-foreground/70">
          Already have an account? <Link to="/login" className="text-gold font-semibold">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
