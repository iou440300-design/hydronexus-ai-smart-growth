import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm } from "@/lib/farm-store";
import { Sparkles, TrendingUp, Leaf, Calendar, Scale, ShieldAlert, Send, Brain, Droplets, FlaskConical, Zap, Clock, Activity, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { crops } from "@/lib/crops";

export const Route = createFileRoute("/app/ai")({
  head: () => ({ meta: [{ title: "AI Assistant — HydroNexus AI" }] }),
  component: AI,
});

interface Msg { role: "user" | "ai"; text: string }

function AI() {
  const { sensors, farms, activeFarmId, farmHealth, lastRecommendation } = useFarm();
  const farm = farms.find((f) => f.id === activeFarmId);
  const crop = crops.find((c) => c.name.toLowerCase() === (farm?.crop ?? "").toLowerCase()) ?? crops[0];

  const risk = farmHealth > 80 ? { label: "Low", color: "var(--success)" } : farmHealth > 60 ? { label: "Moderate", color: "var(--warning)" } : { label: "High", color: "var(--destructive)" };
  const plantingDate = farm ? new Date(farm.plantingDate) : new Date();
  const daysGrown = Math.floor((Date.now() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
  const growthPct = Math.max(5, Math.min(100, (daysGrown / crop.harvestDays) * 100));
  const stage = growthPct < 15 ? "Germination" : growthPct < 40 ? "Seedling" : growthPct < 70 ? "Vegetative" : growthPct < 90 ? "Flowering / Bulking" : "Harvest Window";
  const daysLeft = Math.max(0, crop.harvestDays - daysGrown);

  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: `Hello 👋 I'm HydroNexus AI. I'm watching your ${crop.name} farm in real time. Ask me anything.` },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const u = input.trim();
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: u }]);
    setTimeout(() => {
      const reply = generateReply(u, sensors, crop.name);
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
    }, 600);
  };

  return (
    <div>
      <TopBar title="AI Assistant" subtitle="HydroNexus Intelligence" showFarm={false} />
      <main className="px-4 space-y-4">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-hero text-primary-foreground p-5 shadow-elegant">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-30" style={{ background: "var(--gold)" }} />
          <div className="relative flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gold-gradient grid place-items-center shadow-gold-soft">
              <Sparkles className="h-6 w-6 text-[var(--gold-foreground)]" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider opacity-70">Farm Health</p>
              <p className="text-3xl font-bold">{farmHealth}<span className="opacity-60 text-lg">/100</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider opacity-70">Risk</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full" style={{ background: risk.color, boxShadow: `0 0 8px ${risk.color}` }} />
                {risk.label}
              </span>
            </div>
          </div>
          <p className="relative mt-4 text-sm leading-relaxed">{lastRecommendation}</p>
        </section>

        {/* Growth */}
        <section className="rounded-3xl bg-card border border-border/60 p-5 shadow-card-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Growth Stage</p>
              <p className="text-lg font-semibold flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" />{stage}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Day</p>
              <p className="text-lg font-semibold">{daysGrown}/{crop.harvestDays}</p>
            </div>
          </div>
          <div className="mt-3 h-3 rounded-full bg-muted overflow-hidden relative">
            <div className="h-full bg-leaf-gradient transition-all duration-1000" style={{ width: `${growthPct}%` }} />
            <div className="absolute inset-0 animate-shimmer opacity-40" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard icon={<Calendar className="h-4 w-4" />} label="Harvest In" value={`${daysLeft} days`} />
            <MetricCard icon={<Scale className="h-4 w-4" />} label="Estimated Yield" value={crop.yield} />
          </div>
        </section>

        {/* AI Intelligence grid */}
        <IntelligenceGrid growthPct={growthPct} daysLeft={daysLeft} crop={crop} />


        {/* Recommendations */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Recommendations</h2>
          {buildRecs(sensors, crop.name).map((r, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border/60 p-4 shadow-card-soft flex gap-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
                style={{ background: `color-mix(in oklab, ${r.color} 15%, transparent)`, color: r.color }}>
                {r.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Chat */}
        <section className="rounded-3xl bg-card border border-border/60 shadow-card-soft overflow-hidden">
          <div className="p-4 border-b border-border/60 flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-hero grid place-items-center text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Chat with HydroNexus</p>
              <p className="text-[11px] text-muted-foreground">Tuned for Nigerian growing conditions</p>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto no-scrollbar">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border/60 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about pH, nutrients, pests..."
              className="flex-1 h-11 rounded-2xl bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={send} className="h-11 w-11 rounded-2xl bg-hero text-primary-foreground grid place-items-center shadow-glow">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div className="flex items-center gap-1.5 text-xs text-secondary-foreground/70">{icon}{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}

function buildRecs(s: ReturnType<typeof useFarm>["sensors"], crop: string) {
  const recs: { title: string; body: string; icon: React.ReactNode; color: string }[] = [];
  if (s.waterLevel < 40) recs.push({ title: "Refill Reservoir", body: `Water at ${s.waterLevel.toFixed(0)}%. Top up 40 L to reach optimal 90% for 24 h autonomy.`, icon: <ShieldAlert className="h-4 w-4" />, color: "var(--destructive)" });
  if (s.ph > 6.8) recs.push({ title: "Lower pH", body: `pH ${s.ph.toFixed(2)} is high. Dose 5 ml pH Down (phosphoric acid), mix, recheck in 30 min.`, icon: <TrendingUp className="h-4 w-4" />, color: "var(--warning)" });
  if (s.ec < 1.2) recs.push({ title: "Boost Nutrient EC", body: `EC low for ${crop}. Add 10 ml Nutrient A + 10 ml Nutrient B, stir, recheck.`, icon: <Sparkles className="h-4 w-4" />, color: "var(--warning)" });
  if (s.airTemp > 30) recs.push({ title: "Reduce Canopy Heat", body: `Air ${s.airTemp.toFixed(1)}°C. Increase fans, activate 8 s mist every 6 min, deploy shade net if outdoor.`, icon: <ShieldAlert className="h-4 w-4" />, color: "var(--destructive)" });
  if (recs.length === 0) recs.push({ title: "System Stable", body: "All parameters within optimal band. Maintain current schedule and monitor.", icon: <Leaf className="h-4 w-4" />, color: "var(--success)" });
  return recs.slice(0, 4);
}

function generateReply(q: string, s: ReturnType<typeof useFarm>["sensors"], crop: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("ph")) return `Current pH is ${s.ph.toFixed(2)}. For ${crop}, target 5.5–6.5. ${s.ph > 6.5 ? "Consider a small pH Down dose." : s.ph < 5.5 ? "Add pH Up 3 ml." : "You're in the ideal band."}`;
  if (lower.includes("water")) return `Reservoir is at ${s.waterLevel.toFixed(0)}%. Daily consumption is trending at 148 L. ${s.waterLevel < 40 ? "Recommend refill before evening cycle." : "No refill needed today."}`;
  if (lower.includes("harvest")) return `Based on growth curve for ${crop}, projected harvest window is 14–21 days. Yield estimate: strong.`;
  if (lower.includes("pest")) return `No pest signatures detected in latest AI camera scan. Continue weekly inspections; whitefly risk rises after rainy spells in southern Nigeria.`;
  return `I'm analysing your ${crop} farm now. Sensors are nominal (pH ${s.ph.toFixed(2)}, EC ${s.ec.toFixed(2)}, Air ${s.airTemp.toFixed(1)}°C). Anything specific you'd like me to check?`;
}

function IntelligenceGrid({ growthPct, daysLeft, crop }: { growthPct: number; daysLeft: number; crop: (typeof crops)[number] }) {
  const { sensors, devices, farmHealth } = useFarm();
  const data = useMemo(() => {
    const confidence = Math.round(
      Math.min(99, 60 + farmHealth * 0.35 + (devices.internet ? 4 : 0) + (sensors.ph > 0 ? 2 : -20))
    );
    const growthScore = Math.round(Math.min(100, growthPct * 0.6 + farmHealth * 0.4));
    const yieldBase = parseFloat(crop.yield) || 12;
    const yieldEst = (yieldBase * (0.7 + (farmHealth / 100) * 0.5)).toFixed(1);
    const disease =
      sensors.humidity > 80 || sensors.airTemp > 32 ? { label: "Elevated", c: "var(--warning)" }
        : farmHealth < 60 ? { label: "Moderate", c: "var(--warning)" }
        : { label: "Low", c: "var(--success)" };
    const nutrient =
      sensors.ec < 1.2 ? "Dose A+B 10 ml — EC low"
        : sensors.ec > 2.4 ? "Dilute reservoir with 5 L water"
        : "Nutrient profile optimal";
    const water =
      sensors.waterLevel < 40 ? "Refill 40 L to reach 90%"
        : "Reservoir healthy · no action";
    const energy =
      devices.solar
        ? `Solar covering ${Math.round(60 + Math.random() * 30)}% of load`
        : "Switch to grid inverter — solar offline";
    const next =
      devices.autoMode ? "Auto irrigation · 06:00" : "Manual review · 18:00";
    return { confidence, growthScore, yieldEst, disease, nutrient, water, energy, next };
  }, [sensors, devices, farmHealth, growthPct, crop]);

  const items = [
    { icon: <Brain className="h-4 w-4" />, label: "AI Confidence", value: `${data.confidence}%`, tint: "var(--primary-glow)" },
    { icon: <Leaf className="h-4 w-4" />, label: "Growth Score", value: `${data.growthScore}/100`, tint: "var(--success)" },
    { icon: <Calendar className="h-4 w-4" />, label: "Harvest In", value: `${daysLeft} d`, tint: "var(--gold)" },
    { icon: <Scale className="h-4 w-4" />, label: "Yield Forecast", value: `${data.yieldEst} kg`, tint: "var(--chart-4)" },
    { icon: <ShieldCheck className="h-4 w-4" />, label: "Disease Risk", value: data.disease.label, tint: data.disease.c },
    { icon: <Activity className="h-4 w-4" />, label: "Next Activity", value: data.next, tint: "var(--primary)" },
  ];
  const recs = [
    { icon: <FlaskConical className="h-4 w-4" />, label: "Nutrient", body: data.nutrient, tint: "var(--gold)" },
    { icon: <Droplets className="h-4 w-4" />, label: "Water", body: data.water, tint: "var(--chart-4)" },
    { icon: <Zap className="h-4 w-4" />, label: "Energy", body: data.energy, tint: "var(--warning)" },
  ];

  return (
    <section className="space-y-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Intelligence</h2>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: "color-mix(in oklab, var(--primary-glow) 15%, transparent)", color: "var(--primary)" }}>
          <Clock className="inline h-3 w-3 mr-1" /> Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl bg-card border border-border/60 p-3 shadow-card-soft animate-pop-in">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              <span className="h-6 w-6 rounded-lg grid place-items-center" style={{ background: `color-mix(in oklab, ${it.tint} 15%, transparent)`, color: it.tint }}>{it.icon}</span>
              {it.label}
            </div>
            <div className="mt-1.5 text-base font-bold tabular-nums truncate">{it.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {recs.map((r) => (
          <div key={r.label} className="rounded-2xl bg-card border border-border/60 p-3 shadow-card-soft flex items-center gap-3 animate-pop-in">
            <span className="h-9 w-9 rounded-xl grid place-items-center shrink-0" style={{ background: `color-mix(in oklab, ${r.tint} 15%, transparent)`, color: r.tint }}>{r.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{r.label} Recommendation</p>
              <p className="text-sm font-semibold truncate">{r.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
