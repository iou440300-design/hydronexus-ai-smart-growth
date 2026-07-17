import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Gauge } from "@/components/app/Gauge";
import { useFarm } from "@/lib/farm-store";
import { WaterFlow } from "@/components/app/WaterFlow";
import { Droplets, FlaskConical, Zap, Thermometer, Wind, Sun, Sparkles, Waves, Power } from "lucide-react";

export const Route = createFileRoute("/app/sensors")({
  head: () => ({ meta: [{ title: "Sensors — HydroNexus AI" }] }),
  component: SensorsPage,
});

function SensorsPage() {
  const { sensors, devices } = useFarm();
  return (
    <div>
      <TopBar title="Smart Sensor Grid" subtitle="Live readings from the reservoir & canopy" showFarm={false} />
      <main className="px-4 space-y-4">
        <div className="rounded-3xl bg-hero text-primary-foreground p-5 shadow-elegant">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
            <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" /> Live telemetry · 1.8 s cadence
          </div>
          <p className="mt-2 text-sm opacity-80">All sensors calibrated. Data flowing through the Hardware Service Layer.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Gauge label="Water Level" value={sensors.waterLevel} max={100} unit="%" icon={<Droplets className="h-3.5 w-3.5" />} />
          <Gauge label="pH" value={sensors.ph} max={14} unit="" ideal={[5.5, 6.5]} icon={<FlaskConical className="h-3.5 w-3.5" />} format={(n) => n.toFixed(2)} />
          <Gauge label="EC" value={sensors.ec} max={3.5} unit="mS" ideal={[1.2, 2.4]} icon={<Zap className="h-3.5 w-3.5" />} format={(n) => n.toFixed(2)} />
          <Gauge label="TDS" value={sensors.tds} max={1800} unit="ppm" ideal={[700, 1400]} icon={<Sparkles className="h-3.5 w-3.5" />} format={(n) => n.toFixed(0)} />
          <Gauge label="Water Temp" value={sensors.waterTemp} max={35} unit="°C" ideal={[18, 24]} icon={<Thermometer className="h-3.5 w-3.5" />} />
          <Gauge label="Air Temp" value={sensors.airTemp} max={45} unit="°C" ideal={[20, 30]} icon={<Thermometer className="h-3.5 w-3.5" />} />
          <Gauge label="Humidity" value={sensors.humidity} max={100} unit="%" ideal={[55, 75]} icon={<Wind className="h-3.5 w-3.5" />} format={(n) => n.toFixed(0)} />
          <Gauge label="Light" value={sensors.light / 1000} max={100} unit="k lux" ideal={[25, 60]} icon={<Sun className="h-3.5 w-3.5" />} format={(n) => n.toFixed(1)} />
          <Gauge label="Nutrient" value={sensors.nutrient} max={100} unit="%" ideal={[40, 100]} icon={<FlaskConical className="h-3.5 w-3.5" />} format={(n) => n.toFixed(0)} />
          <Gauge label="Flow Rate" value={sensors.flow} max={5} unit="L/m" ideal={[1.5, 4]} icon={<Waves className="h-3.5 w-3.5" />} format={(n) => n.toFixed(2)} />
        </div>

        <div className="rounded-3xl bg-card p-4 border border-border/60 shadow-card-soft flex items-center gap-3">
          <div className={`h-12 w-12 rounded-2xl grid place-items-center ${devices.waterPump ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>
            <Power className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Water Pump</p>
            <p className="text-xs text-muted-foreground">{devices.waterPump ? `Running · ${sensors.flow.toFixed(2)} L/min` : "Idle · standby"}</p>
            <div className="mt-1"><WaterFlow active={devices.waterPump} /></div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${devices.waterPump ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]" : "bg-muted text-muted-foreground"}`}>
            {devices.waterPump ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </main>
    </div>
  );
}
