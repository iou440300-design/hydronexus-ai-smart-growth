import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm } from "@/lib/farm-store";
import { AlertTriangle, Bell, CheckCheck, Trash2 } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — HydroNexus AI" }] }),
  component: Notifications,
});

const tone = (sev: string) => {
  if (sev === "critical" || sev === "high") return { c: "var(--destructive)", label: sev.toUpperCase() };
  if (sev === "medium") return { c: "var(--warning)", label: "MEDIUM" };
  return { c: "var(--primary)", label: "LOW" };
};

function Notifications() {
  const { alerts, markAllRead, clearAlerts } = useFarm();

  return (
    <div>
      <TopBar title="Notifications" subtitle={`${alerts.length} events`} showFarm={false} />
      <main className="px-4 space-y-3">
        <div className="flex gap-2">
          <button onClick={markAllRead} className="flex-1 h-10 rounded-2xl bg-secondary text-secondary-foreground text-sm font-semibold flex items-center justify-center gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
          <button onClick={clearAlerts} className="h-10 px-4 rounded-2xl bg-card border border-border text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>

        {alerts.length === 0 && (
          <div className="rounded-3xl p-10 border border-dashed border-border text-center text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto opacity-40" />
            <p className="mt-3 text-sm">You're all caught up.</p>
          </div>
        )}

        {alerts.map((a) => {
          const t = tone(a.severity);
          return (
            <div key={a.id} className="rounded-3xl bg-card border border-border/60 shadow-card-soft p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
                  style={{ background: `color-mix(in oklab, ${t.c} 15%, transparent)`, color: t.c }}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{a.title}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ color: t.c, background: `color-mix(in oklab, ${t.c} 12%, transparent)` }}>
                      {t.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                  <div className="mt-2 rounded-xl bg-muted/70 p-2.5 text-xs">
                    <span className="font-semibold text-foreground">Recommended: </span>{a.action}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                    {new Date(a.ts).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
