import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { useFarm } from "@/lib/farm-store";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showFarm?: boolean;
  transparent?: boolean;
}

export function TopBar({ title, subtitle, showBack, showFarm = true, transparent }: Props) {
  const { alerts, farms, activeFarmId } = useFarm();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const unread = alerts.filter((a) => !a.read).length;
  const farm = farms.find((f) => f.id === activeFarmId);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 backdrop-blur-xl",
        transparent ? "bg-transparent" : "bg-background/70 border-b border-border/60"
      )}
    >
      <div className="px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3 flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => nav({ to: ".." as never }).catch(() => nav({ to: "/app" }))}
            className="h-10 w-10 rounded-xl border border-border/60 bg-card/80 grid place-items-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link to="/app" className="flex items-center gap-2">
            <Logo size={36} />
          </Link>
        )}

        <div className="flex-1 min-w-0">
          {title ? (
            <>
              <h1 className="text-lg font-semibold leading-tight truncate">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
            </>
          ) : showFarm && farm ? (
            <button
              onClick={() => nav({ to: "/app/farms" })}
              className="flex items-center gap-1 text-left"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Active Farm</p>
                <p className="text-sm font-semibold truncate flex items-center gap-1">
                  {farm.name} <ChevronDown className="h-3.5 w-3.5" />
                </p>
              </div>
            </button>
          ) : (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">HydroNexus AI</p>
              <p className="text-sm font-semibold">Smart Hydroponics</p>
            </div>
          )}
        </div>

        {pathname !== "/app/notifications" && (
          <Link
            to="/app/notifications"
            className="relative h-10 w-10 rounded-xl border border-border/60 bg-card/80 grid place-items-center"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
