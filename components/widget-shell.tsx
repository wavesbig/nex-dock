"use client";

import { cn } from "@/lib/utils";
import type { GridMode } from "@/hooks/use-gridstack";

interface WidgetShellProps {
  title: string;
  mode: GridMode;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "clean";
}

export function WidgetShell({
  title,
  mode,
  className,
  children,
  variant = "default",
}: WidgetShellProps) {
  const isClean = variant === "clean";

  return (
    <div
      className={cn(
        "grid-stack-item-content relative flex flex-col overflow-hidden transition",
        !isClean && "rounded-2xl bg-card/65 backdrop-blur-glass shadow-glass border border-border/40",
        isClean && "rounded-2xl",
        mode === "edit" && !isClean && "ring-1 ring-border/60",
        className
      )}
    >
      <div
        className={cn(
          "widget-drag-handle px-4 py-2 text-xs text-muted-foreground select-none",
          mode === "view" ? "hidden" : ""
        )}
      >
        <span className="truncate">{title}</span>
      </div>
      <div
        className={cn(
          "flex-1 min-h-0 w-full p-4",
          mode === "edit" && "pointer-events-auto"
        )}
      >
        {children}
      </div>
    </div>
  );
}
