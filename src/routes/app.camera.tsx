import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/app/TopBar";
import { Camera, Upload, ScanLine, CheckCircle2, AlertTriangle, Sparkles, Leaf } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/camera")({
  head: () => ({ meta: [{ title: "AI Camera — HydroNexus AI" }] }),
  component: AICamera,
});

type Result = { verdict: "healthy" | "disease" | "deficiency"; title: string; body: string; confidence: number; rec: string } | null;

const samples: NonNullable<Result>[] = [
  { verdict: "healthy", title: "Healthy Canopy", body: "Vibrant chlorophyll density, no lesions. Photosynthesis efficient.", confidence: 96, rec: "Maintain current lighting cycle (12/12) and EC 1.8." },
  { verdict: "disease", title: "Early Powdery Mildew", body: "Fine white spore layer detected on upper leaves.", confidence: 88, rec: "Increase airflow, reduce humidity to 55%, apply organic potassium bicarbonate spray." },
  { verdict: "deficiency", title: "Nitrogen Deficiency", body: "Yellowing on older leaves, veins remain green.", confidence: 91, rec: "Boost Nutrient A by 15%. Recheck EC in 24 h — target 1.9–2.2." },
];

function AICamera() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const scan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setResult(samples[Math.floor(Math.random() * samples.length)]);
      setScanning(false);
    }, 2400);
  };

  const tint = result?.verdict === "healthy" ? "var(--success)" : result?.verdict === "disease" ? "var(--destructive)" : "var(--warning)";
  const Icon = result?.verdict === "healthy" ? CheckCircle2 : result?.verdict === "disease" ? AlertTriangle : Leaf;

  return (
    <div>
      <TopBar title="AI Vision Scan" subtitle="Detect disease & nutrient issues" showFarm={false} />
      <main className="px-4 space-y-4">
        <section className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/60 aspect-[4/5] bg-hero text-primary-foreground">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className={`h-24 w-24 rounded-3xl bg-white/10 mx-auto grid place-items-center ${scanning ? "animate-pulse-ring" : ""}`}>
                <Camera className="h-10 w-10" />
              </div>
              <p className="mt-4 text-sm opacity-80">{scanning ? "Analyzing leaf tissue..." : "Point at leaf, tap Scan"}</p>
            </div>
          </div>
          {scanning && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--gold)] shadow-[0_0_16px_var(--gold)]" />
          )}
          {/* Corner brackets */}
          {[
            "top-4 left-4 border-t-2 border-l-2",
            "top-4 right-4 border-t-2 border-r-2",
            "bottom-4 left-4 border-b-2 border-l-2",
            "bottom-4 right-4 border-b-2 border-r-2",
          ].map((cls, i) => (
            <div key={i} className={`absolute h-8 w-8 ${cls} border-[var(--gold)] rounded-md`} />
          ))}
        </section>

        <div className="grid grid-cols-3 gap-2">
          <button onClick={scan} disabled={scanning} className="col-span-2 h-14 rounded-2xl bg-hero text-primary-foreground font-semibold shadow-glow flex items-center justify-center gap-2 disabled:opacity-70">
            <ScanLine className="h-5 w-5" /> {scanning ? "Scanning..." : "AI Scan"}
          </button>
          <button className="h-14 rounded-2xl bg-card border border-border/60 flex items-center justify-center gap-2 text-sm font-semibold shadow-card-soft">
            <Upload className="h-4 w-4" /> Upload
          </button>
        </div>

        {result && (
          <section className="rounded-3xl bg-card border border-border/60 p-5 shadow-card-soft animate-fade-up">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-2xl grid place-items-center shrink-0"
                style={{ background: `color-mix(in oklab, ${tint} 15%, transparent)`, color: tint }}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">{result.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{result.body}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${result.confidence}%`, background: tint }} />
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: tint }}>{result.confidence}%</span>
                </div>
                <div className="mt-3 rounded-xl bg-secondary p-3 text-xs">
                  <span className="font-semibold flex items-center gap-1 mb-1"><Sparkles className="h-3.5 w-3.5 text-gold" /> AI Recommendation</span>
                  {result.rec}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
