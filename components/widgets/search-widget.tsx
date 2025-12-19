"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const engines = [
  { key: "baidu", name: "百度", url: (q: string) => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}` },
  { key: "bing", name: "必应", url: (q: string) => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
  { key: "google", name: "谷歌", url: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
];

export function SearchWidget() {
  const [engine, setEngine] = useState(engines[1]);
  const [q, setQ] = useState("");

  const search = () => {
    if (!q.trim()) return;
    window.open(engine.url(q), "_blank");
  };

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <select
          className="rounded-md border bg-white/70 px-2 py-1 text-xs"
          value={engine.key}
          onChange={(e) => {
            const next = engines.find((x) => x.key === e.target.value)!;
            setEngine(next);
          }}
        >
          {engines.map((e) => (
            <option key={e.key} value={e.key}>
              {e.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder={`使用 ${engine.name} 搜索...`}
          className="bg-white/70"
        />
        <Button size="sm" onClick={search}>
          搜索
        </Button>
      </div>
    </div>
  );
}

