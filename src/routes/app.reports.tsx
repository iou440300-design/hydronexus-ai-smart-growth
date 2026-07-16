import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { FileText, Download, FileSpreadsheet, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — HydroNexus AI" }] }),
  component: Reports,
});

const reports = [
  { title: "Daily Report", sub: "Today · 148 L water, 12.4 kWh", cadence: "Daily" },
  { title: "Weekly Report", sub: "Week 28 · Yield forecast +6%", cadence: "Weekly" },
  { title: "Monthly Report", sub: "June 2026 · Full performance", cadence: "Monthly" },
];

function Reports() {
  return (
    <div>
      <TopBar title="Reports" subtitle="Auto-generated insights" showFarm={false} />
      <main className="px-4 space-y-3">
        {reports.map((r) => (
          <div key={r.title} className="rounded-3xl bg-card border border-border/60 p-5 shadow-card-soft">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl bg-secondary text-primary grid place-items-center">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.sub}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => toast.success(`${r.title} exported as PDF`)} className="flex-1 h-10 rounded-xl bg-hero text-primary-foreground text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                  <button onClick={() => toast.success(`${r.title} exported as CSV`)} className="flex-1 h-10 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold flex items-center justify-center gap-1.5">
                    <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
                  </button>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
