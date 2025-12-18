"use client";
import { Switch } from "@/components/ui/switch";
import { SettingsSheet } from "@/components/settings-sheet";
import { DashboardCanvas } from "@/components/dashboard-canvas";
import { useStore } from "zustand";
import { networkStore } from "@/lib/stores/network-store";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  const intranet = useStore(networkStore, (s) => s.intranet);
  const toggle = useStore(networkStore, (s) => s.toggle);
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 rounded-full bg-input/40 p-3 backdrop-blur">
        <SettingsSheet />
      </div>
      <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-center gap-4 px-6 py-4">
        <SearchBar className="w-full max-w-3xl" />
        <div className="flex items-center gap-2 rounded-full border bg-card/80 px-4 py-2 backdrop-blur">
          <span className="text-xs">外网</span>
          <Switch checked={intranet} onCheckedChange={toggle} />
          <span className="text-xs">内网</span>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-6 pt-24">
        <DashboardCanvas />
      </main>
    </div>
  );
}
