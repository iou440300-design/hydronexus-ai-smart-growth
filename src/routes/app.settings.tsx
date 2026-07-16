import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm } from "@/lib/farm-store";
import { Switch } from "@/components/ui/switch";
import { Wifi, Bluetooth, Bell, Gauge, Cloud, WifiOff, PlaySquare, Radio, Languages, Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — HydroNexus AI" }] }),
  component: Settings,
});

const langs = ["English", "Hausa", "Yoruba", "Igbo", "Nigerian Pidgin"];

function Settings() {
  const { liveMode, toggleLiveMode } = useFarm();
  const nav = useNavigate();
  const [lang, setLang] = useState("English");
  const [theme, setTheme] = useState<"light" | "dark">(typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");
  const setThemeMode = (t: "light" | "dark") => {
    setTheme(t);
    if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", t === "dark");
  };

  return (
    <div>
      <TopBar title="Settings" showFarm={false} />
      <main className="px-4 space-y-4">
        {/* Mode */}
        <section className="rounded-3xl bg-hero text-primary-foreground p-5 shadow-elegant">
          <p className="text-xs uppercase tracking-wider opacity-70">Operating Mode</p>
          <div className="mt-2 grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/10">
            <button onClick={() => liveMode && toggleLiveMode()} className={`h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${!liveMode ? "bg-gold-gradient text-[var(--gold-foreground)]" : "opacity-70"}`}>
              <PlaySquare className="h-4 w-4" /> Demo
            </button>
            <button onClick={() => !liveMode && toggleLiveMode()} className={`h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${liveMode ? "bg-white text-primary" : "opacity-70"}`}>
              <Radio className="h-4 w-4" /> Live
            </button>
          </div>
          <p className="mt-2 text-xs opacity-70">
            {liveMode ? "Live mode: awaiting ESP32 telemetry via Hardware Service Layer." : "Demo mode: simulated data flow for showcases."}
          </p>
          <Link to="/app/demo" className="mt-3 inline-flex items-center gap-1 text-sm text-gold font-semibold">Open Demo Panel →</Link>
        </section>

        {/* Language */}
        <SectionCard title="Language" icon={<Languages className="h-4 w-4" />}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {langs.map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 h-9 rounded-full text-xs font-semibold whitespace-nowrap ${lang === l ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Theme */}
        <SectionCard title="Theme">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setThemeMode("light")} className={`h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold border ${theme === "light" ? "bg-secondary border-primary/30 text-primary" : "bg-card border-border"}`}>
              <Sun className="h-4 w-4" /> Light
            </button>
            <button onClick={() => setThemeMode("dark")} className={`h-14 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold border ${theme === "dark" ? "bg-secondary border-primary/30 text-primary" : "bg-card border-border"}`}>
              <Moon className="h-4 w-4" /> Dark
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Connectivity">
          <Row icon={<Wifi className="h-4 w-4" />} label="Wi-Fi" sub="HydroNexus-5G" toggle defaultChecked />
          <Row icon={<Bluetooth className="h-4 w-4" />} label="Bluetooth" sub="Pair ESP32 controller" toggle />
          <Row icon={<Cloud className="h-4 w-4" />} label="Cloud Sync" sub="Backup readings to cloud" toggle defaultChecked />
          <Row icon={<WifiOff className="h-4 w-4" />} label="Offline Mode" sub="Cache last 24 h of data" toggle />
        </SectionCard>

        <SectionCard title="System">
          <Row icon={<Bell className="h-4 w-4" />} label="Notifications" sub="Alerts, harvest, maintenance" toggle defaultChecked />
          <Row icon={<Gauge className="h-4 w-4" />} label="Sensor Calibration" sub="Last: 2 days ago" chevron />
        </SectionCard>

        <button
          onClick={() => nav({ to: "/login" })}
          className="w-full h-12 rounded-2xl bg-card border border-border text-destructive font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="text-center text-[11px] text-muted-foreground pb-4">HydroNexus AI · v1.0.0 · AgroPulse Technologies</p>
      </main>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
        {icon}{title}
      </p>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Row({ icon, label, sub, toggle, defaultChecked, chevron }: { icon: React.ReactNode; label: string; sub?: string; toggle?: boolean; defaultChecked?: boolean; chevron?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-9 w-9 rounded-xl bg-secondary text-primary grid place-items-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{label}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
      {toggle && <Switch defaultChecked={defaultChecked} />}
      {chevron && <span className="text-muted-foreground">›</span>}
    </div>
  );
}
