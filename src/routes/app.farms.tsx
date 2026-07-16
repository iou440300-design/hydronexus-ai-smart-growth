import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { useFarm } from "@/lib/farm-store";
import { CheckCircle2, MapPin, Leaf, Calendar, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/farms")({
  head: () => ({ meta: [{ title: "Farms — HydroNexus AI" }] }),
  component: Farms,
});

function Farms() {
  const { farms, activeFarmId, setActiveFarm, addFarm } = useFarm();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <TopBar title="Farm Management" subtitle={`${farms.length} sites`} showFarm={false} />
      <main className="px-4 space-y-3">
        {farms.map((f) => {
          const active = f.id === activeFarmId;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFarm(f.id)}
              className={`w-full text-left rounded-3xl p-5 border transition ${active ? "bg-hero text-primary-foreground shadow-elegant border-transparent" : "bg-card border-border/60 shadow-card-soft"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">{f.name}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${active ? "opacity-70" : "text-muted-foreground"}`}>
                    <MapPin className="h-3.5 w-3.5" /> {f.location}
                  </p>
                </div>
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-bold text-[var(--gold-foreground)]">
                    <CheckCircle2 className="h-3 w-3" /> ACTIVE
                  </span>
                )}
              </div>
              <div className={`mt-4 grid grid-cols-3 gap-2 text-xs ${active ? "" : ""}`}>
                <FarmChip label="Crop" value={f.crop} icon={<Leaf className="h-3 w-3" />} dark={active} />
                <FarmChip label="Stage" value={f.stage} dark={active} />
                <FarmChip label="Harvest" value={new Date(f.harvestDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} icon={<Calendar className="h-3 w-3" />} dark={active} />
              </div>
              <p className={`mt-3 text-xs ${active ? "opacity-70" : "text-muted-foreground"} line-clamp-2`}>{f.notes}</p>
              <p className={`mt-2 text-[10px] uppercase tracking-wider ${active ? "opacity-60" : "text-muted-foreground"}`}>
                Owner · {f.owner}
              </p>
            </button>
          );
        })}

        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-3xl border-2 border-dashed border-border p-5 flex items-center justify-center gap-2 text-primary font-semibold"
        >
          <Plus className="h-4 w-4" /> Add new farm
        </button>

        {open && <AddFarmModal onClose={() => setOpen(false)} onAdd={(f) => { addFarm(f); setOpen(false); }} />}
      </main>
    </div>
  );
}

function FarmChip({ label, value, icon, dark }: { label: string; value: string; icon?: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`rounded-xl p-2 ${dark ? "bg-white/10" : "bg-secondary"}`}>
      <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider ${dark ? "opacity-70" : "text-muted-foreground"}`}>{icon}{label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}

function AddFarmModal({ onClose, onAdd }: { onClose: () => void; onAdd: (f: Parameters<ReturnType<typeof useFarm>["addFarm"]>[0]) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm grid place-items-end sm:place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-card p-5 shadow-elegant border border-border" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">New Farm</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onAdd({
              name: fd.get("name") as string,
              location: fd.get("location") as string,
              crop: fd.get("crop") as string,
              plantingDate: fd.get("plantingDate") as string,
              harvestDate: fd.get("harvestDate") as string,
              stage: "Seedling",
              owner: fd.get("owner") as string,
              notes: (fd.get("notes") as string) ?? "",
            });
          }}
          className="mt-4 space-y-2"
        >
          {[
            { n: "name", p: "Farm name" }, { n: "location", p: "Location" }, { n: "crop", p: "Crop" },
            { n: "owner", p: "Owner" },
          ].map((f) => (
            <input key={f.n} name={f.n} required placeholder={f.p} className="w-full h-11 rounded-xl bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
          ))}
          <div className="grid grid-cols-2 gap-2">
            <input type="date" name="plantingDate" required className="h-11 rounded-xl bg-muted px-3 text-sm" />
            <input type="date" name="harvestDate" required className="h-11 rounded-xl bg-muted px-3 text-sm" />
          </div>
          <textarea name="notes" placeholder="Notes" className="w-full rounded-xl bg-muted p-3 text-sm min-h-[64px] outline-none focus:ring-2 focus:ring-ring" />
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-xl bg-muted text-sm font-semibold">Cancel</button>
            <button className="flex-1 h-11 rounded-xl bg-hero text-primary-foreground text-sm font-semibold">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
