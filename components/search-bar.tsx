"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    window.open(
      `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative flex items-center overflow-hidden rounded-full bg-background/40 backdrop-blur border border-border/50 px-2 shadow-glass transition">
        {/* Search Engine Icon / Dropdown Trigger (Simplified as per design) */}
        <div className="flex h-12 w-14 items-center justify-center border-r border-border/50">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-glass">
            度
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="输入搜索内容..."
          className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder-muted-foreground outline-none"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="m-1 flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95 shadow-glass"
        >
          搜索
        </button>
      </div>
    </div>
  );
}
