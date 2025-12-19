import { DashboardCanvas } from "@/components/dashboard-canvas";
import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-foreground selection:bg-orange-500/30">
      {/* Background Image - Green Hills & Sunset */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop")', // Green hills + sunset vibe
        }}
      />
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/10" />

      {/* Sidebar - Fixed Left */}
      <div className="fixed bottom-0 left-0 top-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex min-h-screen w-full flex-col pl-[80px]">
        {/* Header with Search Bar */}
        <div className="w-full pt-10 pb-6">
          <SiteHeader className="relative top-0 right-0 left-0" />
        </div>

        {/* Scrollable Grid Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 pb-10 scrollbar-hide">
          <DashboardCanvas />
        </div>

        {/* Footer */}
        <footer className="py-4 text-center text-[10px] text-white/40 font-medium tracking-wider">
          渝ICP备15002199号-13
        </footer>
      </main>
    </div>
  );
}
