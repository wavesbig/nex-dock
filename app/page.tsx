import { DashboardCanvas } from "@/components/dashboard-canvas";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SiteHeader />
      <main className="relative mx-auto max-w-6xl px-6 pt-24">
        <DashboardCanvas />
      </main>
    </div>
  );
}
