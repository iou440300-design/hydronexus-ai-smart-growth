import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/app/Logo";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const nav = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => nav({ to: "/login" }), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [nav]);

  return (
    <div className="fixed inset-0 bg-hero overflow-hidden">
      {/* Background orbs */}
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: "var(--primary-glow)" }} />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: "var(--gold)" }} />

      {/* Falling drops */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full animate-drop"
            style={{
              left: `${(i * 79) % 100}%`,
              top: `${(i * 43) % 90}%`,
              background: "color-mix(in oklab, white 70%, transparent)",
              animationDelay: `${(i % 6) * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center px-8 text-primary-foreground">
        <div
          className="transition-all duration-700"
          style={{ transform: phase >= 1 ? "scale(1)" : "scale(0.6)", opacity: phase >= 1 ? 1 : 0 }}
        >
          <div className="animate-float">
            <Logo size={120} className="drop-shadow-2xl" />
          </div>
        </div>
        <div
          className="mt-8 text-center transition-all duration-700"
          style={{ transform: phase >= 2 ? "translateY(0)" : "translateY(12px)", opacity: phase >= 2 ? 1 : 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight">HydroNexus <span className="text-gold">AI</span></h1>
          <p className="mt-2 text-sm text-primary-foreground/70">Smart Hydroponics. Intelligent Growth.</p>
        </div>

        <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-primary-foreground/50">
          by AgroPulse Technologies
        </div>
      </div>
    </div>
  );
}
