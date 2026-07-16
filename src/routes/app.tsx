import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FarmProvider } from "@/lib/farm-store";
import { BottomNav } from "@/components/app/BottomNav";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <FarmProvider>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-md pb-32">
          <Outlet />
        </div>
        <BottomNav />
        <Toaster position="top-center" richColors />
      </div>
    </FarmProvider>
  );
}
