import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm } from "@/lib/farm-store";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — HydroNexus AI" }] }),
  component: Analytics,
});

function Analytics() {
  const { history } = useFarm();
  const data = history.map((h, i) => ({
    name: new Date(h.t).getHours() + ":00",
    ph: +h.ph.toFixed(2),
    ec: +h.ec.toFixed(2),
    airTemp: +h.airTemp.toFixed(1),
    waterTemp: +h.waterTemp.toFixed(1),
    humidity: +h.humidity.toFixed(0),
    water: +h.water.toFixed(1),
    energy: +h.energy.toFixed(2),
    growth: +h.growth.toFixed(1),
    idx: i,
  }));

  return (
    <div>
      <TopBar title="Analytics" subtitle="24 h rolling insights" showFarm={false} />
      <main className="px-4 space-y-4">
        <ChartCard title="Growth Curve" sub="Estimated biomass %">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="grow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={5} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Area type="monotone" dataKey="growth" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#grow)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-2 gap-3">
          <ChartCard title="Water Usage" sub="Liters">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={data}>
                <Bar dataKey="water" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
                <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Energy" sub="kWh">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={data}>
                <Bar dataKey="energy" fill="var(--gold)" radius={[6, 6, 0, 0]} />
                <Tooltip cursor={false} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="pH History" sub="24 h">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={5} stroke="var(--muted-foreground)" />
              <YAxis domain={[5, 7.5]} tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Line type="monotone" dataKey="ph" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Temperature" sub="Air & Water °C">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={5} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Line type="monotone" dataKey="airTemp" stroke="var(--chart-5)" strokeWidth={2.5} dot={false} name="Air" />
              <Line type="monotone" dataKey="waterTemp" stroke="var(--chart-4)" strokeWidth={2.5} dot={false} name="Water" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Humidity" sub="RH %">
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="hum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={5} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Area type="monotone" dataKey="humidity" stroke="var(--chart-4)" strokeWidth={2.5} fill="url(#hum)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-3xl bg-gold-gradient text-[var(--gold-foreground)] p-5 shadow-gold-soft">
          <p className="text-xs uppercase tracking-wider opacity-80">Harvest Forecast</p>
          <p className="text-2xl font-bold mt-1">18 days · 42 kg est.</p>
          <p className="text-xs mt-2 opacity-80">Yield prediction based on current growth curve and Lagos climate model.</p>
        </div>
      </main>
    </div>
  );
}

function ChartCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
      {children}
    </div>
  );
}
