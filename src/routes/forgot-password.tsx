import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/app/Logo";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — HydroNexus AI" }] }),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen bg-hero flex flex-col">
      <div className="flex-1 flex flex-col px-6 pt-12 pb-6 max-w-md mx-auto w-full text-primary-foreground">
        <Logo size={48} />
        <h1 className="mt-6 text-3xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-primary-foreground/70">Enter your email and we'll send you a secure link.</p>

        {sent ? (
          <div className="mt-8 glass rounded-3xl p-6 text-center animate-fade-up">
            <CheckCircle2 className="h-12 w-12 text-gold mx-auto" />
            <p className="mt-3 font-semibold">Check your inbox</p>
            <p className="text-sm text-primary-foreground/70 mt-1">If that email exists, we've sent a reset link.</p>
            <Link to="/login" className="mt-4 inline-block text-gold font-semibold">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 glass rounded-3xl p-5 space-y-4 shadow-elegant">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-4 h-12">
              <Mail className="h-4 w-4 opacity-70" />
              <input type="email" required placeholder="you@farm.ng" className="flex-1 bg-transparent outline-none text-sm placeholder:text-primary-foreground/40" />
            </div>
            <button className="w-full h-12 rounded-2xl bg-gold-gradient text-[var(--gold-foreground)] font-semibold flex items-center justify-center gap-2">
              Send reset link <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/login" className="block text-center text-sm text-primary-foreground/70">Back to sign in</Link>
          </form>
        )}
      </div>
    </div>
  );
}
