import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { MapPin, Leaf, Camera, BarChart3, FileText, Building2, Settings, PlaySquare, Bell, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/more")({
  head: () => ({ meta: [{ title: "More — HydroNexus AI" }] }),
  component: More,
});

const links = [
  { to: "/app/farms", label: "Farm Management", sub: "Multi-farm control", icon: MapPin, tint: "var(--primary-glow)" },
  { to: "/app/crops", label: "Crop Library", sub: "9 crops with growing profiles", icon: Leaf, tint: "var(--leaf)" },
  { to: "/app/camera", label: "AI Vision Scan", sub: "Detect disease & deficiency", icon: Camera, tint: "var(--gold)" },
  { to: "/app/analytics", label: "Analytics", sub: "Charts & forecasts", icon: BarChart3, tint: "var(--chart-4)" },
  { to: "/app/reports", label: "Reports", sub: "PDF & CSV exports", icon: FileText, tint: "var(--warning)" },
  { to: "/app/shareholder", label: "Shareholder Dashboard", sub: "Financials & KPIs", icon: Building2, tint: "var(--gold)" },
  { to: "/app/notifications", label: "Notifications", sub: "All alerts", icon: Bell, tint: "var(--destructive)" },
  { to: "/app/demo", label: "Demo Panel", sub: "Simulate scenarios", icon: PlaySquare, tint: "var(--chart-3)" },
  { to: "/app/settings", label: "Settings", sub: "Language, theme, sensors", icon: Settings, tint: "var(--muted-foreground)" },
] as const;

function More() {
  return (
    <div>
      <TopBar title="More" showFarm={false} />
      <main className="px-4 space-y-3">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft">
              <div className="h-11 w-11 rounded-2xl grid place-items-center" style={{ background: `color-mix(in oklab, ${l.tint} 15%, transparent)`, color: l.tint }}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{l.label}</p>
                <p className="text-xs text-muted-foreground truncate">{l.sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </main>
    </div>
  );
}
