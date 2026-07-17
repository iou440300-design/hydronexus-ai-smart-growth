import { cn } from "@/lib/utils";

/**
 * Animated water-flow indicator. Renders only when `active` (pump ON).
 * Uses CSS-only stroke-dash marching + drop animation for zero JS overhead.
 */
export function WaterFlow({ active, className, label = "Flow" }: { active: boolean; className?: string; label?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg viewBox="0 0 80 20" className="h-5 w-20" aria-hidden>
        <defs>
          <linearGradient id="wf-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--chart-4)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--chart-4)" />
            <stop offset="100%" stopColor="var(--chart-4)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M2 10 Q 12 2, 22 10 T 42 10 T 62 10 T 78 10" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" />
        {active && (
          <path
            d="M2 10 Q 12 2, 22 10 T 42 10 T 62 10 T 78 10"
            fill="none"
            stroke="url(#wf-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 8"
            style={{ animation: "wf-march 1s linear infinite" }}
          />
        )}
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: active ? "var(--chart-4)" : "var(--muted-foreground)" }}>
        {active ? label : "Idle"}
      </span>
    </div>
  );
}
