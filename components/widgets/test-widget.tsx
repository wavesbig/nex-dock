"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TestWidget() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex h-full w-full flex-col items-start justify-between rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md">
      <div className="text-sm opacity-80">测试组件</div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold">{count}</span>
        <span className="text-xs opacity-70">次</span>
      </div>
      <div className="mt-2">
        <Button size="sm" onClick={() => setCount((v) => v + 1)}>
          点击增加
        </Button>
      </div>
    </div>
  );
}

