import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { crops } from "@/lib/crops";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/crops")({
  head: () => ({ meta: [{ title: "Crop Library — HydroNexus AI" }] }),
  component: CropLib,
});

function CropLib() {
  const [q, setQ] = useState("");
  const filtered = crops.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <TopBar title="Crop Library" subtitle="Optimized for Nigerian growers" showFarm={false} />
      <main className="px-4 space-y-3">
        <div className="flex items-center gap-2 h-12 rounded-2xl bg-card border border-border/60 px-4 shadow-card-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search crops..." className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((c) => (
            <Link to="/app/crops/$slug" params={{ slug: c.slug }} key={c.slug} className="group">
              <div className="rounded-3xl bg-card border border-border/60 p-4 shadow-card-soft hover:shadow-glow transition h-full">
                <div className="h-16 w-16 rounded-2xl bg-leaf-gradient grid place-items-center text-3xl mb-2 shadow-glow">
                  {c.emoji}
                </div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">pH {c.ph[0]}–{c.ph[1]} · {c.harvestDays}d</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-primary font-semibold">View <ArrowRight className="h-3 w-3" /></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
