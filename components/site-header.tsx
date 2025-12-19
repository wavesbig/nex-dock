"use client";

import { SearchBar } from "@/components/search-bar";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={cn("fixed left-0 right-0 top-0 z-40 flex items-center justify-center py-8", className)}>
      <SearchBar className="w-full max-w-2xl shadow-2xl" />
      
      {/* Top Right Icons (Leaf logo?) - Optional based on image */}
      <div className="absolute right-8 top-8 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
         {/* Leaf icon placeholder */}
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
      </div>
    </header>
  );
}
