"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Engine = {
  key: string;
  name: string;
  url: string;
};

const DEFAULT_ENGINES: Engine[] = [
  { key: "bing", name: "Bing", url: "https://www.bing.com/search?q={q}" },
  { key: "baidu", name: "百度", url: "https://www.baidu.com/s?wd={q}" },
  { key: "google", name: "Google", url: "https://www.google.com/search?q={q}" },
];

function EngineBadge({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const label =
    id === "bing"
      ? "b"
      : id === "baidu"
      ? "度"
      : id === "google"
      ? "G"
      : name.trim().slice(0, 1).toUpperCase();

  const bg =
    id === "bing"
      ? "bg-[#1a73e8]"
      : id === "baidu"
      ? "bg-[#d61f1f]"
      : id === "google"
      ? "bg-gradient-to-br from-[#4285F4] via-[#EA4335] to-[#FBBC05]"
      : "bg-muted-foreground";

  return (
    <div
      className={cn(
        "flex size-9 items-center justify-center rounded-xl text-base font-semibold text-white",
        bg,
        className
      )}
      aria-hidden
    >
      {label}
    </div>
  );
}

export function SearchBar({ className }: { className?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState(false);
  const [engines, setEngines] = useState<Engine[]>(DEFAULT_ENGINES);
  const [engineKey, setEngineKey] = useState<string>(DEFAULT_ENGINES[0].key);

  const current = useMemo(
    () => engines.find((e) => e.key === engineKey) ?? engines[0],
    [engines, engineKey]
  );

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const [enginesRes, settingsRes] = await Promise.all([
          fetch("/api/search/engines", { signal: controller.signal }),
          fetch("/api/search/settings", { signal: controller.signal }),
        ]);
        const enginesJson = (await enginesRes.json()) as { engines?: unknown };
        const settingsJson = (await settingsRes.json()) as {
          selectedEngineKey?: unknown;
        };

        const fetchedEngines = Array.isArray(enginesJson.engines)
          ? (enginesJson.engines as Engine[])
          : [];
        const normalized = fetchedEngines.filter(
          (e) =>
            typeof e?.key === "string" &&
            typeof e?.name === "string" &&
            typeof e?.url === "string" &&
            e.url.includes("{q}")
        );

        const selected =
          typeof settingsJson.selectedEngineKey === "string"
            ? settingsJson.selectedEngineKey
            : null;

        if (!active) return;
        if (normalized.length > 0) setEngines(normalized);
        const fallbackKey = (normalized[0]?.key ??
          DEFAULT_ENGINES[0].key) as string;
        setEngineKey(
          selected && normalized.some((e) => e.key === selected)
            ? selected
            : fallbackKey
        );
      } catch {
        if (!active) return;
        setEngines(DEFAULT_ENGINES);
        setEngineKey(DEFAULT_ENGINES[0].key);
      }
    };

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isSlash = e.key === "/";
      const isCtrlK =
        (e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey);
      if (isSlash || isCtrlK) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpenPanel(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!openPanel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPanel(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!rootRef.current?.contains(target)) setOpenPanel(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openPanel]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current) return;
    const url = current.url.replace("{q}", encodeURIComponent(query.trim()));
    if (query.trim().length === 0) return;
    window.open(url, "_blank");
  };

  const addEngine = async () => {
    const name = window.prompt("搜索引擎名称");
    if (!name) return;
    const url = window.prompt("搜索 URL（使用 {q} 作为关键词占位）");
    if (!url || !url.includes("{q}")) return;

    try {
      const res = await fetch("/api/search/engines", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, url }),
      });
      const json = (await res.json()) as { engine?: Engine };
      if (!res.ok || !json.engine) return;

      setEngines((prev) => {
        const next = [
          ...prev.filter((e) => e.key !== json.engine!.key),
          json.engine!,
        ];
        return next;
      });
      setEngineKey(json.engine.key);
      setOpenPanel(false);
      inputRef.current?.focus();

      await fetch("/api/search/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedEngineKey: json.engine.key }),
      });
    } catch {}
  };

  const selectEngine = async (key: string) => {
    setEngineKey(key);
    setOpenPanel(false);
    inputRef.current?.focus();
    try {
      await fetch("/api/search/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selectedEngineKey: key }),
      });
    } catch {}
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={submit}
        className="flex w-full items-center gap-3 rounded-2xl border bg-card/80 px-4 py-3 shadow-sm backdrop-blur"
      >
        <Button
          type="button"
          variant="ghost"
          className="h-10 gap-2 px-2"
          onClick={() => setOpenPanel((v) => !v)}
          aria-label="选择搜索引擎"
        >
          {current ? (
            <EngineBadge
              id={current.key}
              name={current.name}
              className="size-8 rounded-lg text-sm"
            />
          ) : null}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入搜索内容（/ 或 Ctrl+K 快速聚焦）"
          aria-label="搜索"
          className="h-10"
        />
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span>/</span>
          <span>Ctrl</span>
          <span>K</span>
        </div>
        <Button type="submit" className="px-5">
          搜索
        </Button>
      </form>

      {openPanel && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl border bg-card/90 p-4 shadow-sm backdrop-blur">
          <div className="grid grid-cols-3 gap-4">
            {engines.map((e) => (
              <button
                key={e.key}
                onClick={() => {
                  void selectEngine(e.key);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
                  e.key === engineKey ? "bg-accent" : "hover:bg-accent"
                )}
              >
                <EngineBadge
                  id={e.key}
                  name={e.name}
                  className="size-12 rounded-2xl text-xl"
                />
                <span className="font-medium">{e.name}</span>
              </button>
            ))}
            <button
              onClick={addEngine}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border px-4 py-4 text-sm hover:bg-accent"
            >
              <Plus className="size-4" />
              <span>添加</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
