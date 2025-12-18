"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AnniversaryWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white/20 shadow-lg backdrop-blur-md">
      {/* Background Image Placeholder */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop")',
        }} // Placeholder image
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/40 to-transparent" />

      <div className="relative z-20 flex h-full items-center justify-between px-8 py-6 text-white">
        <div className="flex flex-col justify-between h-full">
          <div className="text-sm font-medium opacity-90">与 Tina 相识</div>
          <div>
            <div className="text-5xl font-bold tracking-tight">
              2,038 <span className="text-2xl font-normal">天</span>
            </div>
            <div className="mt-1 text-sm opacity-80">2020年5月20日</div>
          </div>
        </div>

        {/* Analog Clock */}
        <div className="relative size-32 rounded-full border-2 border-white/50 bg-white/10 backdrop-blur-sm">
          {/* Hour Hand */}
          <div
            className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-white"
            style={{
              transform: `translateX(-50%) translateY(-100%) rotate(${hourDegrees}deg)`,
            }}
          />
          {/* Minute Hand */}
          <div
            className="absolute left-1/2 top-1/2 h-12 w-0.5 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-white"
            style={{
              transform: `translateX(-50%) translateY(-100%) rotate(${minuteDegrees}deg)`,
            }}
          />
          {/* Second Hand */}
          <div
            className="absolute left-1/2 top-1/2 h-12 w-px -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-red-400"
            style={{
              transform: `translateX(-50%) translateY(-100%) rotate(${secondDegrees}deg)`,
            }}
          />
          {/* Center Dot */}
          <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
