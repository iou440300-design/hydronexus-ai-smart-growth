import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm } from "@/lib/farm-store";
import { Switch } from "@/components/ui/switch";
import { Droplets, FlaskConical, Lightbulb, Fan, ValveIcon, Zap, PowerOff, Clock } from "lucide-react";
import type { DeviceState } from "@/lib/hardware-service";
import { toast } from "sonner";

// Substitute icon for missing valve
const ValveGlyph = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 12h4M16 12h4" /><circle cx="12" cy="12" r="4" /><path d="M12 4v4M12 16v4" />
  </svg>
);

export const Route = createFileRoute("/app/controls")({
  head: () => ({ meta: [{ title: "Controls — HydroNexus AI" }] }),
  component: Controls,
});

type Key = keyof DeviceState;

function Controls() {
  const { devices, setDevice, emergencyStop } = useFarm();

  const toggle = (k: Key, label: string) => {
    const next = !devices[k];
    setDevice(k, next);
    toast.success(`${label} ${next ? "activated" : "stopped"}`);
  };

  const ctl: { key: Key; label: string; sub: string; icon: React.ReactNode; tint: string }[] = [
    { key: "waterPump", label: "Water Pump", sub: "Irrigation main line", icon: <Droplets className="h-5 w-5" />, tint: "var(--chart-4)" },
    { key: "nutrientPump", label: "Nutrient Pump", sub: "Dosing A + B", icon: <FlaskConical className="h-5 w-5" />, tint: "var(--gold)" },
    { key: "lighting", label: "Grow Lighting", sub: "LED full spectrum", icon: <Lightbulb className="h-5 w-5" />, tint: "var(--warning)" },
    { key: "fans", label: "Ventilation Fans", sub: "Canopy airflow", icon: <Fan className="h-5 w-5" />, tint: "var(--primary-glow)" },
    { key: "drainValve", label: "Drain Valve", sub: "Reservoir outflow", icon: <ValveGlyph className="h-5 w-5" />, tint: "var(--destructive)" },
  ];

  return (
    <div>
      <TopBar title="Smart Controls" subtitle="Actuators & automation" showFarm={false} />
      <main className="px-4 space-y-4">
        {/* Auto / Manual */}
        <section className="rounded-3xl p-5 bg-hero text-primary-foreground shadow-elegant">
          <p className="text-xs uppercase tracking-wider opacity-70">Operating Mode</p>
          <div className="mt-2 grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/10">
            <button
              onClick={() => { setDevice("autoMode", true); toast.success("Auto mode engaged"); }}
              className={`h-11 rounded-xl text-sm font-semibold transition ${devices.autoMode ? "bg-gold-gradient text-[var(--gold-foreground)] shadow-gold-soft" : "text-primary-foreground/70"}`}
            >
              <Zap className="inline h-4 w-4 mr-1" /> Auto Mode
            </button>
            <button
              onClick={() => { setDevice("autoMode", false); toast.success("Manual mode"); }}
              className={`h-11 rounded-xl text-sm font-semibold transition ${!devices.autoMode ? "bg-white text-primary shadow-glow" : "text-primary-foreground/70"}`}
            >
              Manual
            </button>
          </div>
          <p className="mt-3 text-xs opacity-70">
            {devices.autoMode ? "AI is orchestrating pumps, lights and fans based on live telemetry." : "You are in full control. Automations are paused."}
          </p>
        </section>

        {/* Actuator cards */}
        <section className="space-y-3">
          {ctl.map((c) => {
            const active = !!devices[c.key];
            return (
              <div key={c.key} className="rounded-3xl bg-card border border-border/60 shadow-card-soft p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl grid place-items-center shrink-0"
                  style={{ background: `color-mix(in oklab, ${c.tint} 15%, transparent)`, color: c.tint }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{c.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.sub}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${active ? "text-[var(--success)]" : "text-muted-foreground"}`}>
                    {active ? "ONLINE" : "IDLE"}
                  </p>
                  <Switch checked={active} onCheckedChange={() => toggle(c.key, c.label)} />
                </div>
              </div>
            );
          })}
        </section>

        {/* Scheduling */}
        <section className="rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Scheduling</h3>
          </div>
          {[
            { name: "Morning Irrigation", time: "06:00 · 12 min", active: true },
            { name: "Midday Nutrient Boost", time: "12:30 · 3 min", active: true },
            { name: "Evening Light Off", time: "20:00", active: true },
            { name: "Weekly Drain & Refill", time: "Sun · 05:00", active: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-border/50">
              <div>
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.time}</p>
              </div>
              <Switch defaultChecked={s.active} />
            </div>
          ))}
        </section>

        {/* Emergency stop */}
        <button
          onClick={() => { emergencyStop(); toast.error("Emergency Stop engaged — all actuators OFF"); }}
          className="w-full rounded-3xl p-5 flex items-center justify-center gap-3 font-bold uppercase tracking-wider text-destructive-foreground shadow-elegant"
          style={{ background: "linear-gradient(135deg, var(--destructive), color-mix(in oklab, var(--destructive) 70%, black))" }}
        >
          <PowerOff className="h-5 w-5" /> Emergency Stop
        </button>
      </main>
    </div>
  );
}
