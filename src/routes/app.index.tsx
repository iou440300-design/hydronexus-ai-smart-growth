import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { HardwareStatus } from "@/components/app/HardwareStatus";
import { WaterFlow } from "@/components/app/WaterFlow";
import { useFarm } from "@/lib/farm-store";
import {
  Droplets, FlaskConical, Thermometer, Wind, Sun, Battery, Wifi, WifiOff,
  Fan, Lightbulb, Zap, Cloud, Sparkles, ArrowRight, AlertTriangle, Activity, Leaf
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — HydroNexus AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { sensors, devices, alerts, farmHealth, lastRecommendation, lastUpdated, farms, activeFarmId } = useFarm();
  const farm = farms.find((f) => f.id === activeFarmId);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const ago = Math.max(0, Math.floor((now - lastUpdated) / 1000));

  const healthColor = farmHealth > 80 ? "var(--success)" : farmHealth > 60 ? "var(--warning)" : "var(--destructive)";

  return (
    <div>
      <TopBar />
      <main className="px-4 space-y-5">
        {/* Live hardware strip */}
        <HardwareStatus />
        {/* Health hero */}
        <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-primary-foreground shadow-elegant animate-fade-up">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-40" style={{ background: "var(--primary-glow)" }} />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl opacity-25" style={{ background: "var(--gold)" }} />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/60">Farm Health Score</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-6xl font-bold tracking-tight">{farmHealth}</span>
                <span className="text-primary-foreground/60">/ 100</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: healthColor, boxShadow: `0 0 8px ${healthColor}` }} />
                {farmHealth > 80 ? "Excellent" : farmHealth > 60 ? "Attention" : "Critical"}
              </div>
            </div>
            <RingScore value={farmHealth} color={healthColor} />
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2 text-xs">
            <MiniStat label="AI" value="Active" icon={<Sparkles className="h-3.5 w-3.5" />} accent />
            <MiniStat label="Crop" value={farm?.crop ?? "-"} icon={<Leaf className="h-3.5 w-3.5" />} />
            <MiniStat label="Updated" value={`${ago}s ago`} icon={<Activity className="h-3.5 w-3.5" />} />
          </div>
        </section>

        {/* Tanks */}
        <section className="grid grid-cols-2 gap-3">
          <TankCard label="Water Tank" value={sensors.waterLevel} accent="var(--chart-4)" icon={<Droplets className="h-4 w-4" />} />
          <TankCard label="Nutrient Tank" value={sensors.nutrient} accent="var(--gold)" icon={<FlaskConical className="h-4 w-4" />} />
        </section>

        {/* Systems */}
        <section className="rounded-3xl bg-card shadow-card-soft border border-border/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Systems</h2>
            <Link to="/app/controls" className="text-xs text-primary font-semibold flex items-center gap-1">Manage <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <StatusChip label="Pump" active={devices.waterPump} icon={<Droplets className="h-4 w-4" />} />
            <StatusChip label="Lights" active={devices.lighting} icon={<Lightbulb className="h-4 w-4" />} />
            <StatusChip label="Fans" active={devices.fans} icon={<Fan className="h-4 w-4" />} />
            <StatusChip label="Solar" active={devices.solar} icon={<Sun className="h-4 w-4" />} />
            <StatusChip label="Battery" active={devices.battery > 20} icon={<Battery className="h-4 w-4" />} sub={`${devices.battery.toFixed(0)}%`} />
            <StatusChip label="Internet" active={devices.internet} icon={devices.internet ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />} />
            <StatusChip label="Cloud" active={devices.internet} icon={<Cloud className="h-4 w-4" />} />
            <StatusChip label="Auto" active={devices.autoMode} icon={<Zap className="h-4 w-4" />} />
          </div>
        </section>

        {/* Environment */}
        <section className="grid grid-cols-2 gap-3">
          <EnvCard icon={<Thermometer className="h-4 w-4" />} label="Air Temp" value={`${sensors.airTemp.toFixed(1)}°`} sub="Canopy" />
          <EnvCard icon={<Droplets className="h-4 w-4" />} label="Water Temp" value={`${sensors.waterTemp.toFixed(1)}°`} sub="Reservoir" />
          <EnvCard icon={<Wind className="h-4 w-4" />} label="Humidity" value={`${sensors.humidity.toFixed(0)}%`} sub="RH" />
          <EnvCard icon={<Sun className="h-4 w-4" />} label="Light" value={`${(sensors.light / 1000).toFixed(1)}k`} sub="lux" />
        </section>

        {/* Consumption */}
        <section className="grid grid-cols-2 gap-3">
          <ConsumeCard label="Water Today" value={`${devices.waterLiters.toFixed(1)} L`} icon={<Droplets className="h-4 w-4" />} tint="var(--chart-4)" />
          <ConsumeCard label="Energy Today" value={`${devices.energyKwh.toFixed(2)} kWh`} icon={<Zap className="h-4 w-4" />} tint="var(--gold)" />
        </section>

        {/* AI recommendation */}
        <Link to="/app/ai" className="block">
          <section className="relative overflow-hidden rounded-3xl bg-leaf-gradient p-5 text-primary-foreground shadow-glow">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-white/20 grid place-items-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-80">Latest AI Recommendation</p>
                  <p className="text-sm font-semibold">HydroNexus Assistant</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm leading-relaxed">{lastRecommendation}</p>
          </section>
        </Link>

        {/* Today's alerts */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Today's Alerts</h2>
            <Link to="/app/notifications" className="text-xs text-primary font-semibold">See all</Link>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-2xl bg-card border border-border/60 p-3 shadow-card-soft">
                <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
                  style={{
                    background: a.severity === "critical" ? "color-mix(in oklab, var(--destructive) 15%, transparent)" :
                                a.severity === "high" ? "color-mix(in oklab, var(--destructive) 10%, transparent)" :
                                a.severity === "medium" ? "color-mix(in oklab, var(--warning) 15%, transparent)" :
                                "color-mix(in oklab, var(--primary) 10%, transparent)",
                  }}>
                  <AlertTriangle className="h-4 w-4" style={{ color: a.severity === "medium" ? "var(--warning)" : a.severity === "low" ? "var(--primary)" : "var(--destructive)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                No alerts. Your farm is running smoothly.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function RingScore({ value, color }: { value: number; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
        <circle cx="40" cy="40" r={r} stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1s" }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-semibold">
        {value >= 90 ? "A+" : value >= 80 ? "A" : value >= 70 ? "B" : value >= 60 ? "C" : "D"}
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon, accent }: { label: string; value: string; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${accent ? "bg-gold-gradient text-[var(--gold-foreground)]" : "bg-white/10 border border-white/10"}`}>
      <div className="flex items-center gap-1.5 opacity-80 text-[10px] uppercase tracking-wider">{icon}{label}</div>
      <div className="text-sm font-semibold mt-0.5 truncate">{value}</div>
    </div>
  );
}

function TankCard({ label, value, accent, icon }: { label: string; value: number; accent: string; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft h-36">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value.toFixed(0)}<span className="text-lg text-muted-foreground">%</span></div>
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
        style={{ height: `${value}%`, background: `linear-gradient(180deg, transparent 0%, color-mix(in oklab, ${accent} 30%, transparent) 100%)` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
      />
    </div>
  );
}

function StatusChip({ label, active, icon, sub }: { label: string; active: boolean; icon: React.ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`h-12 w-12 rounded-2xl grid place-items-center border ${active ? "bg-secondary border-primary/20 text-primary" : "bg-muted/50 border-border text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="text-[10px] font-medium leading-tight text-center">
        <div>{label}</div>
        <div className={active ? "text-primary" : "text-muted-foreground"}>{sub ?? (active ? "On" : "Off")}</div>
      </div>
    </div>
  );
}

function EnvCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">{icon}{label}</div>
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function ConsumeCard({ label, value, icon, tint }: { label: string; value: string; icon: React.ReactNode; tint: string }) {
  return (
    <div className="rounded-3xl p-4 shadow-card-soft border border-border/60"
      style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${tint} 10%, var(--card)) 0%, var(--card) 100%)` }}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        <span className="h-6 w-6 grid place-items-center rounded-lg" style={{ background: `color-mix(in oklab, ${tint} 20%, transparent)`, color: tint }}>{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}
