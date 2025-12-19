"use client";

import { useEffect, useState } from "react";

export function InfoWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  return (
    <div className="flex h-full w-full items-center justify-between rounded-xl bg-white/10 p-4 text-white">
      <div>
        <div className="text-sm opacity-80">今天</div>
        <div className="text-2xl font-bold">{now.toLocaleDateString()}</div>
      </div>
      <div className="text-4xl font-mono">{fmt}</div>
    </div>
  );
}

