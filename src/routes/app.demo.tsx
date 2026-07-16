import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm, type Scenario } from "@/lib/farm-store";
import { Droplets, FlaskConical, Thermometer, Zap, WifiOff, Wind, Leaf, Sun, PowerOff, RotateCcw, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/app/demo")({
  head: () => ({ meta: [{ title: "Demo Panel — HydroNexus AI" }] }),
  component: Demo,
});

const scenarios: { key: Scenario; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "lowWater", label: "Low Water", icon: <Droplets className="h-5 w-5" />, color: "var(--destructive)" },
  { key: "highPh", label: "High pH", icon: <FlaskConical className="h-5 w-5" />, color: "var(--warning)" },
  { key: "highTemp", label: "High Temp", icon: <Thermometer className="h-5 w-5" />, color: "var(--destructive)" },
  { key: "pumpFailure", label: "Pump Failure", icon: <PowerOff className="h-5 w-5" />, color: "var(--destructive)" },
  { key: "powerFailure", label: "Power Failure", icon: <Zap className="h-5 w-5" />, color: "var(--destructive)" },
  { key: "sensorFailure", label: "Sensor Failure", icon: <RotateCcw className="h-5 w-5" />, color: "var(--warning)" },
  { key: "nutrientDeficiency", label: "Low Nutrient", icon: <FlaskConical className="h-5 w-5" />, color: "var(--warning)" },
  { key: "lowHumidity", label: "Low Humidity", icon: <Wind className="h-5 w-5" />, color: "var(--warning)" },
  { key: "harvestReady", label: "Harvest Ready", icon: <Leaf className="h-5 w-5" />, color: "var(--success)" },
  { key: "internetFailure", label: "Internet Down", icon: <WifiOff className="h-5 w-5" />, color: "var(--warning)" },
];

function Demo() {
  const { scenario, runScenario, setDevice } = useFarm();
  const [competition, setCompetition] = useState(false);
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => { timers.current.forEach((t) => clearTimeout(t)); timers.current = []; };

  const startCompetitionMode = () => {
    setCompetition(true);
    setStep(0);
    clearTimers();
    const steps = [
      { at: 0, do: () => { runScenario("healthy"); toast.success("Stage 1 — Farm is Healthy"); setStep(1); } },
      { at: 6000, do: () => { runScenario("lowWater"); toast.warning("Stage 2 — Water Level Dropping..."); setStep(2); } },
      { at: 14000, do: () => { toast.error("Stage 3 — Critical Alert Raised!"); setStep(3); } },
      { at: 20000, do: () => { toast("Stage 4 — AI Detected the Issue", { icon: "🧠" }); setStep(4); } },
      { at: 26000, do: () => { toast("Stage 5 — AI Recommends Auto Mode", { icon: "✨" }); setStep(5); } },
      { at: 32000, do: () => { setDevice("autoMode", true); toast.success("Stage 6 — Auto Mode Engaged"); setStep(6); } },
      { at: 36000, do: () => { setDevice("waterPump", true); toast.success("Stage 7 — Pump Activated"); setStep(7); } },
      { at: 40000, do: () => { runScenario("healthy"); toast.success("Stage 8 — Water Restored"); setStep(8); } },
      { at: 44000, do: () => { toast.success("Stage 9 — Farm Health Excellent ✨"); setStep(9); setCompetition(false); } },
    ];
    steps.forEach((s) => { timers.current.push(window.setTimeout(s.do, s.at)); });
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <div>
      <TopBar title="Demo Control Panel" subtitle="Simulate any scenario" showFarm={false} />
      <main className="px-4 space-y-4">
        <section className="relative overflow-hidden rounded-3xl bg-gold-gradient p-5 text-[var(--gold-foreground)] shadow-gold-soft">
          <p className="text-xs uppercase tracking-wider opacity-80">Competition Mode</p>
          <p className="text-xl font-bold mt-1">45-second autonomous demonstration</p>
          <p className="text-xs mt-1 opacity-80">Healthy → Alert → AI → Auto → Recovery</p>
          <button onClick={startCompetitionMode} disabled={competition} className="mt-3 h-11 px-4 rounded-2xl bg-[color-mix(in_oklab,black_20%,transparent)] text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-60">
            <PlayCircle className="h-4 w-4" /> {competition ? `Running · step ${step}/9` : "Start Demonstration"}
          </button>
          {competition && (
            <div className="mt-3 h-1.5 rounded-full bg-black/20 overflow-hidden">
              <div className="h-full bg-white/90 transition-all duration-500" style={{ width: `${(step / 9) * 100}%` }} />
            </div>
          )}
        </section>

        <section>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Scenarios</p>
          <div className="grid grid-cols-2 gap-3">
            {scenarios.map((s) => (
              <button
                key={s.key}
                onClick={() => { runScenario(s.key); toast.success(`Simulating: ${s.label}`); }}
                className={`rounded-2xl p-4 border text-left transition ${scenario === s.key ? "bg-hero text-primary-foreground border-transparent shadow-glow" : "bg-card border-border shadow-card-soft"}`}
              >
                <div className={`h-10 w-10 rounded-xl grid place-items-center mb-2`}
                  style={{ background: scenario === s.key ? "color-mix(in oklab, white 15%, transparent)" : `color-mix(in oklab, ${s.color} 15%, transparent)`, color: scenario === s.key ? "white" : s.color }}>
                  {s.icon}
                </div>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className={`text-[11px] ${scenario === s.key ? "opacity-70" : "text-muted-foreground"}`}>
                  {scenario === s.key ? "Active" : "Tap to run"}
                </p>
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={() => { runScenario("healthy"); toast.success("Reset to healthy baseline"); }}
          className="w-full h-12 rounded-2xl bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2"
        >
          <Sun className="h-4 w-4" /> Reset to Healthy
        </button>
      </main>
    </div>
  );
}
