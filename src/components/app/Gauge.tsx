import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  min?: number;
  max: number;
  label: string;
  unit?: string;
  size?: number;
  ideal?: [number, number];
  format?: (n: number) => string;
  icon?: React.ReactNode;
  className?: string;
}

export function Gauge({
  value,
  min = 0,
  max,
  label,
  unit = "",
  size = 140,
  ideal,
  format,
  icon,
  className,
}: GaugeProps) {
  const [animated, setAnimated] = useState(min);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(value));
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const pct = Math.max(0, Math.min(1, (animated - min) / (max - min)));
  const stroke = 10;
  const r = (size - stroke) / 2 - 6;
  const c = size / 2;
  const circumference = Math.PI * r; // half circle
  const dashOffset = circumference * (1 - pct);

  let status: "ok" | "warn" | "crit" = "ok";
  if (ideal) {
    const [lo, hi] = ideal;
    if (value < lo * 0.85 || value > hi * 1.15) status = "crit";
    else if (value < lo || value > hi) status = "warn";
  } else {
    if (pct < 0.2) status = "crit";
    else if (pct < 0.4) status = "warn";
  }

  const color =
    status === "ok" ? "var(--success)" : status === "warn" ? "var(--warning)" : "var(--destructive)";

  return (
    <div
      className={cn(
        "relative rounded-3xl bg-card p-4 shadow-card-soft border border-border/60 flex flex-col items-center",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider self-start">
        {icon}
        <span>{label}</span>
      </div>
      <div style={{ width: size, height: size / 2 + 12 }} className="relative">
        <svg width={size} height={size / 2 + 12} viewBox={`0 0 ${size} ${size / 2 + 12}`}>
          <defs>
            <linearGradient id={`g-${label}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>
          <path
            d={`M ${c - r} ${c} A ${r} ${r} 0 0 1 ${c + r} ${c}`}
            stroke="var(--muted)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${c - r} ${c} A ${r} ${r} 0 0 1 ${c + r} ${c}`}
            stroke={`url(#g-${label})`}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
          <div className="text-2xl font-bold tabular-nums text-foreground">
            {format ? format(value) : value.toFixed(1)}
            <span className="text-xs text-muted-foreground ml-1">{unit}</span>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span style={{ color }}>{status === "ok" ? "Optimal" : status === "warn" ? "Attention" : "Critical"}</span>
      </div>
    </div>
  );
}
