import { Link, useLocation } from "@tanstack/react-router";
import { Home, Activity, Sparkles, SlidersHorizontal, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/app" | "/app/sensors" | "/app/ai" | "/app/controls" | "/app/more";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  primary?: boolean;
};

const items: NavItem[] = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/sensors", label: "Sensors", icon: Activity },
  { to: "/app/ai", label: "AI", icon: Sparkles, primary: true },
  { to: "/app/controls", label: "Controls", icon: SlidersHorizontal },
  { to: "/app/more", label: "More", icon: Menu },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-4 pb-3">
        <div className="glass rounded-3xl shadow-elegant flex items-center justify-around px-2 py-2">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            const Icon = it.icon;
            if (it.primary) {
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-hero shadow-glow text-primary-foreground"
                >
                  <span className="absolute inset-0 rounded-2xl animate-pulse-ring" />
                  <Icon className="h-6 w-6" />
                </Link>
              );
            }
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "drop-shadow")} strokeWidth={active ? 2.4 : 1.8} />
                <span className="text-[10px] font-medium">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
