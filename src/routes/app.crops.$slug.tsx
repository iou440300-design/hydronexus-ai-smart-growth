import { createFileRoute, notFound } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { crops } from "@/lib/crops";
import { FlaskConical, Zap, Thermometer, Wind, Calendar, Scale, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/app/crops/$slug")({
  head: ({ params }) => {
    const c = crops.find((x) => x.slug === params.slug);
    return { meta: [{ title: c ? `${c.name} — Crop Library` : "Crop — HydroNexus AI" }] };
  },
  loader: ({ params }) => {
    const c = crops.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  component: CropDetail,
  notFoundComponent: () => <div className="p-10 text-center">Crop not found.</div>,
  errorComponent: () => <div className="p-10 text-center">Something went wrong.</div>,
});

function CropDetail() {
  const c = Route.useLoaderData();
  return (
    <div>
      <TopBar title={c.name} subtitle="Growing profile" showBack showFarm={false} />
      <main className="px-4 space-y-4">
        <section className="rounded-3xl bg-hero text-primary-foreground p-6 shadow-elegant flex items-center gap-4">
          <div className="h-20 w-20 rounded-3xl bg-white/10 grid place-items-center text-5xl">{c.emoji}</div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">Hydroponics Profile</p>
            <p className="text-2xl font-bold">{c.name}</p>
            <p className="text-sm opacity-80 mt-1">{c.harvestDays} day cycle · {c.yield}</p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <Stat icon={<FlaskConical className="h-4 w-4" />} label="Ideal pH" value={`${c.ph[0]} – ${c.ph[1]}`} />
          <Stat icon={<Zap className="h-4 w-4" />} label="Ideal EC" value={`${c.ec[0]} – ${c.ec[1]} mS/cm`} />
          <Stat icon={<Thermometer className="h-4 w-4" />} label="Temperature" value={`${c.temp[0]}° – ${c.temp[1]}°`} />
          <Stat icon={<Wind className="h-4 w-4" />} label="Humidity" value={`${c.humidity[0]}% – ${c.humidity[1]}%`} />
          <Stat icon={<Calendar className="h-4 w-4" />} label="Harvest In" value={`${c.harvestDays} days`} />
          <Stat icon={<Scale className="h-4 w-4" />} label="Est. Yield" value={c.yield} />
        </section>

        <section className="rounded-3xl bg-card border border-border/60 p-5 shadow-card-soft">
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-gold" /> Growing Tips
          </div>
          <p className="text-sm leading-relaxed">{c.tips}</p>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 p-4 shadow-card-soft">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">{icon}{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
