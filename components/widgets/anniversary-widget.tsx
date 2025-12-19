"use client";

import { useEffect, useState } from "react";

export function AnniversaryWidget() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = (time ?? new Date(0)).getHours();
  const minutes = (time ?? new Date(0)).getMinutes();
  const seconds = (time ?? new Date(0)).getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6;
  const secondDegrees = seconds * 6;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop")', // Use a nice field/home image like the example
        }}
      />

      {/* Glass Overlay */}
      <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[2px]" />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

      <div className="relative z-20 flex h-full items-center justify-between px-10 py-6 text-white">
        <div className="flex flex-col justify-center h-full gap-2">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 text-white/80">
            <span>与 Tina 相识</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-bold tracking-tight drop-shadow-lg">
              2,039
            </span>
            <span className="text-2xl font-normal opacity-80">天</span>
          </div>
          <div className="mt-2 text-sm font-medium opacity-70 bg-black/10 px-3 py-1 rounded-full w-fit backdrop-blur-md">
            2020年5月20日
          </div>
        </div>

        {/* Analog Clock - Right Side */}
        <div
          className="relative size-40 rounded-full border border-white/30 bg-white/10 backdrop-blur-md shadow-2xl"
          suppressHydrationWarning
        >
          {/* Clock Markings */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-0 h-full w-px bg-transparent"
              style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
            >
              <div className="h-2 w-full bg-white/60" />
            </div>
          ))}

          {/* Hour Hand */}
          <div
            className="absolute left-1/2 top-1/2 h-10 w-1.5 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-white shadow-sm"
            style={{
              transform: `translateX(-50%) translateY(-100%) rotate(${
                mounted ? hourDegrees : 0
              }deg)`,
            }}
          />
          {/* Minute Hand */}
          <div
            className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-white shadow-sm"
            style={{
              transform: `translateX(-50%) translateY(-100%) rotate(${
                mounted ? minuteDegrees : 0
              }deg)`,
            }}
          />
          {/* Second Hand */}
          <div
            className="absolute left-1/2 top-1/2 h-16 w-0.5 -translate-x-1/2 -translate-y-full origin-bottom rounded-full bg-orange-400 shadow-sm"
            style={{
              transform: `translateX(-50%) translateY(-100%) rotate(${
                mounted ? secondDegrees : 0
              }deg)`,
            }}
          />
          {/* Center Dot */}
          <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border-2 border-gray-200" />
        </div>
      </div>

      {/* Bottom Label Bar (Similar to the image 'Memorial Day') */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md py-1 text-center text-[10px] text-white/60">
        纪念日
      </div>
    </div>
  );
}
