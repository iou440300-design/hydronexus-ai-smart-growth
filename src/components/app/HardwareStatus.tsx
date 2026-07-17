import { useEffect, useState } from "react";
import { Cpu, Radio, Wifi, WifiOff, Cloud, CloudOff, CheckCircle2 } from "lucide-react";
import { useFarm } from "@/lib/farm-store";
import { HardwareService } from "@/lib/hardware-service";

/**
 * Live hardware status strip. Reflects the Hardware Service Layer transport
 * plus live sensor connectivity. In DEMO mode we surface the simulated bus so
 * the UI is production-shaped and ready for ESP32 / REST / MQTT / Firebase.
 */
export function HardwareStatus() {
  const { devices, lastUpdated, liveMode } = useFarm();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ago = Math.max(0, Math.floor((now - lastUpdated) / 1000));
  const transport = HardwareService.getTransport();

  const items = [
    { label: "ESP32", ok: true, icon: <Cpu className="h-3.5 w-3.5" />, sub: liveMode ? transport.toUpperCase() : "DEMO" },
    { label: "Hardware", ok: devices.waterPump || devices.lighting || devices.fans, icon: <Radio className="h-3.5 w-3.5" />, sub: "Online" },
    { label: "Wi-Fi", ok: devices.internet, icon: devices.internet ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />, sub: devices.internet ? "5 GHz" : "Down" },
    { label: "Cloud", ok: devices.internet, icon: devices.internet ? <Cloud className="h-3.5 w-3.5" /> : <CloudOff className="h-3.5 w-3.5" />, sub: devices.internet ? "Sync" : "Cached" },
  ];

  return (
    <section className="rounded-2xl bg-card border border-border/60 shadow-card-soft px-3 py-2 animate-fade-up">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--success)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--success)" }} />
          </span>
          Live Hardware
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <CheckCircle2 className="h-3 w-3" style={{ color: "var(--success)" }} />
          <span className="tabular-nums">Updated {ago}s ago</span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex flex-col items-center rounded-xl px-1.5 py-2 border border-border/50"
            style={{
              background: it.ok
                ? "color-mix(in oklab, var(--success) 8%, transparent)"
                : "color-mix(in oklab, var(--destructive) 8%, transparent)",
            }}
          >
            <span style={{ color: it.ok ? "var(--success)" : "var(--destructive)" }}>{it.icon}</span>
            <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-foreground leading-none text-center">{it.label}</span>
            <span className="text-[9px] text-muted-foreground leading-tight mt-0.5 truncate max-w-full">{it.sub}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
