"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSearchEngines,
  getSearchSettings,
  createSearchEngine,
  updateSearchSettings,
} from "@/services/api/search.api";
import { SearchEngine } from "@/types/search.dto";

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

  const [engines, setEngines] = useState<SearchEngine[]>([]);
  const [selectedEngineKey, setSelectedEngineKey] = useState<string | null>(
    null
  );

  const fetchData = useCallback(async () => {
    try {
      const [enginesRes, settingsRes] = await Promise.all([
        getSearchEngines(),
        getSearchSettings(),
      ]);
      setEngines(enginesRes.engines);
      setSelectedEngineKey(settingsRes.selectedEngineKey);
    } catch (err) {
      console.error("Failed to fetch search data:", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [localEngineKey, setLocalEngineKey] = useState<string | undefined>();

  const activeKey = localEngineKey ?? selectedEngineKey ?? engines[0]?.key;

  const current = useMemo(
    () => engines.find((e) => e.key === activeKey) ?? engines[0],
    [engines, activeKey]
  );

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

  const handleAddEngine = async () => {
    const name = window.prompt("搜索引擎名称");
    if (!name) return;
    const url = window.prompt("搜索 URL（使用 {q} 作为关键词占位）");
    if (!url || !url.includes("{q}")) return;

    try {
      const res = await createSearchEngine({ name, url });
      if (!res.engine) return;

      await fetchData();

      setLocalEngineKey(res.engine.key);
      setOpenPanel(false);
      inputRef.current?.focus();

      await updateSearchSettings({ selectedEngineKey: res.engine.key });
      setSelectedEngineKey(res.engine.key);
      await fetchData();
    } catch {
      // ignore
    }
  };

  const handleSelectEngine = async (key: string) => {
    setLocalEngineKey(key);
    setOpenPanel(false);
    inputRef.current?.focus();
    try {
      await updateSearchSettings({ selectedEngineKey: key });
      setSelectedEngineKey(key);
      await fetchData();
    } catch {}
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={submit}
        className="flex w-full items-center gap-3 rounded-2xl border-0 bg-white/60 px-4 py-3 shadow-lg backdrop-blur-md transition-all hover:bg-white/70 focus-within:bg-white/80"
      >
        <Button
          type="button"
          variant="ghost"
          className="h-10 gap-2 px-2 hover:bg-white/20"
          onClick={() => setOpenPanel((v) => !v)}
          aria-label="选择搜索引擎"
        >
          {current ? (
            <EngineBadge
              id={current.key}
              name={current.name}
              className="size-8 rounded-lg text-sm shadow-sm"
            />
          ) : null}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入搜索内容..."
          aria-label="搜索"
          className="h-10 border-none bg-transparent text-lg placeholder:text-muted-foreground/70 focus-visible:ring-0 shadow-none"
        />
        <Button
          type="submit"
          className="px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md"
        >
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
                  void handleSelectEngine(e.key);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm transition-colors",
                  e.key === activeKey ? "bg-accent" : "hover:bg-accent"
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
              onClick={handleAddEngine}
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
