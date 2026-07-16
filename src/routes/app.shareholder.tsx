import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { TrendingUp, Users, Leaf, Heart, DollarSign, Building2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/app/shareholder")({
  head: () => ({ meta: [{ title: "Shareholders — HydroNexus AI" }] }),
  component: Share,
});

const financials = [
  { m: "Jan", rev: 12, profit: 3 }, { m: "Feb", rev: 15, profit: 4.2 },
  { m: "Mar", rev: 22, profit: 6.8 }, { m: "Apr", rev: 28, profit: 9 },
  { m: "May", rev: 34, profit: 11.6 }, { m: "Jun", rev: 41, profit: 14.4 },
  { m: "Jul", rev: 48, profit: 17.5 },
];

function Share() {
  return (
    <div>
      <TopBar title="Shareholder Dashboard" subtitle="AgroPulse Technologies" showFarm={false} />
      <main className="px-4 space-y-4">
        <section className="rounded-3xl bg-hero text-primary-foreground p-6 shadow-elegant">
          <p className="text-xs uppercase tracking-wider opacity-70">Share Capital</p>
          <p className="text-4xl font-bold mt-1">₦ 250M</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <MiniFin label="Revenue YTD" value="₦48M" />
            <MiniFin label="Gross Profit" value="₦24M" />
            <MiniFin label="Net Profit" value="₦17.5M" />
          </div>
        </section>

        <div className="rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Revenue & Profit</p>
            <span className="text-xs text-[var(--success)] font-semibold flex items-center gap-1"><TrendingUp className="h-3 w-3" />+42%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={financials}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Area type="monotone" dataKey="rev" name="Revenue (₦M)" stroke="var(--chart-1)" fill="url(#rev)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="profit" name="Profit (₦M)" stroke="var(--gold)" fill="url(#pro)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <KPI icon={<Building2 className="h-4 w-4" />} label="Systems Installed" value="142" tint="var(--primary-glow)" />
          <KPI icon={<Users className="h-4 w-4" />} label="Customer Satisfaction" value="97%" tint="var(--success)" />
          <KPI icon={<Heart className="h-4 w-4" />} label="CSR Investment" value="₦4.8M" tint="var(--destructive)" />
          <KPI icon={<Leaf className="h-4 w-4" />} label="CO₂ Saved" value="18 t" tint="var(--leaf)" />
          <KPI icon={<DollarSign className="h-4 w-4" />} label="Avg Deal Size" value="₦1.2M" tint="var(--gold)" />
          <KPI icon={<TrendingUp className="h-4 w-4" />} label="Q3 Growth" value="+42%" tint="var(--chart-4)" />
        </div>
      </main>
    </div>
  );
}

function MiniFin({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-2">
      <p className="text-[10px] uppercase opacity-70">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
function KPI({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-card-soft">
      <div className="h-8 w-8 rounded-lg grid place-items-center mb-2" style={{ background: `color-mix(in oklab, ${tint} 15%, transparent)`, color: tint }}>{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
