import { DashboardCanvas } from "@/components/dashboard-canvas";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-foreground">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop")',
        }} // Sunset landscape
      />
      <div className="absolute inset-0 z-0 bg-black/10" />

      {/* Sidebar */}
      <div className="fixed bottom-0 left-0 top-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center pl-[80px]">
        {/* Search Bar Area */}
        <div className="mt-20 w-full max-w-2xl px-4">
          <SearchBar className="shadow-lg" />
        </div>

        {/* Widgets Grid */}
        <div className="mt-12 w-full flex-1 px-4">
          <DashboardCanvas />
        </div>

        {/* Footer */}
        <footer className="pb-4 text-xs text-white/60">
          渝ICP备15002199号-13
        </footer>
      </main>
    </div>
  );
}
