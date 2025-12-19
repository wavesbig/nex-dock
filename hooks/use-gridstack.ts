"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GridStack, type GridStackWidget } from "gridstack";

export type GridMode = "view" | "edit";

type UseGridStackOptions = {
  storageKey?: string;
  column?: number;
  cellHeight?: number | string;
  margin?: number;
  onDragStart?: (el: HTMLElement) => void;
  onDrag?: (el: HTMLElement) => void;
  onDragStop?: (el: HTMLElement) => void;
};

export function useGridStack(options?: UseGridStackOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<GridStack | null>(null);
  const [mode, setMode] = useState<GridMode>("view");
  const storageKey = options?.storageKey ?? "desktop:gridstack";
  const column = options?.column ?? 12;
  const cellHeight = options?.cellHeight ?? 60;
  const margin = options?.margin ?? 20;
  const [guides, setGuides] = useState<{
    v: number[];
    h: number[];
    visible: boolean;
  }>({ v: [], h: [], visible: false });
  const zCounterRef = useRef<number>(10);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const grid = GridStack.init(
      {
        column,
        cellHeight,
        margin,
        handle: ".widget-drag-handle",
        alwaysShowResizeHandle: false,
        float: false,
      },
      el
    );

    gridRef.current = grid;

    // register already rendered items
    el.querySelectorAll<HTMLElement>(".grid-stack-item").forEach((item) => {
      grid.makeWidget(item);
    });

    // restore layout if present
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved: GridStackWidget[] = JSON.parse(raw);
        saved.forEach((w) => {
          const target = w.id
            ? el.querySelector<HTMLElement>(`.grid-stack-item[gs-id="${w.id}"]`)
            : null;
          if (target) grid.update(target, w);
        });
      }
    } catch {}

    // start in view mode: fully static (no dd/handles)
    grid.setStatic(true);

    // save changes while editing
    const saveIfEditing = () => {
      if (mode !== "edit") return;
      const data = grid.save(true) as GridStackWidget[];
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {}
    };

    // helpers
    const colWidth = () => {
      const c = containerRef.current;
      return c ? c.clientWidth / column : 1;
    };
    const pxToGrid = (left: number, top: number, el: HTMLElement) => {
      const x = Math.round(left / colWidth());
      const y = Math.round(
        top / (typeof cellHeight === "number" ? cellHeight : 60)
      );
      // clamp boundaries
      const w = Number(el.getAttribute("gs-w") ?? 1);
      const h = Number(el.getAttribute("gs-h") ?? 1);
      const maxX = Math.max(0, column - w);
      const c = containerRef.current;
      const maxRows = c
        ? Math.max(
            0,
            Math.floor(
              c.clientHeight /
                (typeof cellHeight === "number" ? cellHeight : 60)
            ) - h
          )
        : y;
      return {
        x: Math.min(Math.max(0, x), maxX),
        y: Math.min(Math.max(0, y), maxRows),
      };
    };

    const computeGuides = (el: HTMLElement) => {
      const c = containerRef.current;
      if (!c) return;
      const threshold = 16; // px
      const rect = el.getBoundingClientRect();
      const crect = c.getBoundingClientRect();
      const v: number[] = [];
      const h: number[] = [];
      // edges vs container
      const leftDist = Math.abs(rect.left - crect.left);
      const rightDist = Math.abs(rect.right - crect.right);
      const topDist = Math.abs(rect.top - crect.top);
      const bottomDist = Math.abs(rect.bottom - crect.bottom);
      if (leftDist <= threshold) v.push(rect.left - crect.left);
      if (rightDist <= threshold) v.push(rect.right - crect.left);
      if (topDist <= threshold) h.push(rect.top - crect.top);
      if (bottomDist <= threshold) h.push(rect.bottom - crect.top);
      // vs other items
      c.querySelectorAll<HTMLElement>(".grid-stack-item").forEach((n) => {
        if (n === el) return;
        const r = n.getBoundingClientRect();
        const candidates = [r.left - crect.left, r.right - crect.left];
        candidates.forEach((x) => {
          if (
            Math.abs(rect.left - crect.left - x) <= threshold ||
            Math.abs(rect.right - crect.left - x) <= threshold
          )
            v.push(x);
        });
        const candidatesY = [r.top - crect.top, r.bottom - crect.top];
        candidatesY.forEach((y) => {
          if (
            Math.abs(rect.top - crect.top - y) <= threshold ||
            Math.abs(rect.bottom - crect.top - y) <= threshold
          )
            h.push(y);
        });
      });
      setGuides({
        v: Array.from(new Set(v)),
        h: Array.from(new Set(h)),
        visible: true,
      });
    };

    const snapPixel = (value: number, base = 8) =>
      Math.round(value / base) * base;

    const onDragStart = (_event: Event, el: HTMLElement) => {
      // raise z-index
      const fixed = el.getAttribute("data-fixed") === "true";
      if (!fixed) {
        zCounterRef.current += 1;
        el.style.zIndex = String(zCounterRef.current);
      } else {
        el.style.zIndex = "0";
      }
      setGuides((g) => ({ ...g, visible: true }));
      options?.onDragStart?.(el);
    };

    const onDrag = (_event: Event, el: HTMLElement) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        computeGuides(el);
        options?.onDrag?.(el);
      });
    };

    const onDragStop = (_event: Event, el: HTMLElement) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setGuides({ v: [], h: [], visible: false });
      // snap to 8px grid
      const c = containerRef.current;
      if (!c) return;
      const crect = c.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      // compute snapped left/top in pixels relative to container
      let left = snapPixel(rect.left - crect.left, 8);
      let top = snapPixel(rect.top - crect.top, 8);
      const threshold = 16;
      // proximity snap to other items and container edges
      const candidatesX: number[] = [0, c.clientWidth];
      const candidatesY: number[] = [0, c.clientHeight];
      c.querySelectorAll<HTMLElement>(".grid-stack-item").forEach((n) => {
        if (n === el) return;
        const r = n.getBoundingClientRect();
        candidatesX.push(r.left - crect.left, r.right - crect.left);
        candidatesY.push(r.top - crect.top, r.bottom - crect.top);
      });
      // horizontal snap
      candidatesX.forEach((cx) => {
        // try align left edge
        if (Math.abs(left - cx) <= threshold) left = cx;
        // try align right edge
        const rightTarget = cx - rect.width;
        if (Math.abs(left - rightTarget) <= threshold) left = rightTarget;
      });
      // vertical snap
      candidatesY.forEach((cy) => {
        // top edge
        if (Math.abs(top - cy) <= threshold) top = cy;
        // bottom edge
        const bottomTarget = cy - rect.height;
        if (Math.abs(top - bottomTarget) <= threshold) top = bottomTarget;
      });
      // boundaries
      left = Math.max(0, Math.min(left, c.clientWidth - rect.width));
      top = Math.max(0, Math.min(top, c.clientHeight - rect.height));
      const { x, y } = pxToGrid(left, top, el);
      const grid = gridRef.current;
      if (grid) grid.update(el, { x, y });
      saveIfEditing();
      options?.onDragStop?.(el);
    };

    grid.on("change", saveIfEditing);
    grid.on("dragstart", onDragStart);
    grid.on("drag", onDrag);
    grid.on("dragstop", onDragStop);
    grid.on("resizestop", saveIfEditing);

    return () => {
      grid.off("change");
      grid.off("dragstart");
      grid.off("drag");
      grid.off("dragstop");
      grid.off("resizestop");
      grid.destroy(false);
      gridRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef.current]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (mode === "edit") grid.setStatic(false);
    else grid.setStatic(true);
  }, [mode]);

  const api = useMemo(() => {
    return {
      get grid() {
        return gridRef.current;
      },
      containerRef,
      guides,
      mode,
      setMode,
      toggleMode() {
        setMode((m) => (m === "view" ? "edit" : "view"));
      },
      save() {
        const grid = gridRef.current;
        if (!grid) return [] as GridStackWidget[];
        const data = grid.save(true) as GridStackWidget[];
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch {}
        return data;
      },
      load() {
        const grid = gridRef.current;
        const el = containerRef.current;
        if (!grid || !el) return;
        try {
          const raw = localStorage.getItem(storageKey);
          if (!raw) return;
          const saved: GridStackWidget[] = JSON.parse(raw);
          saved.forEach((w) => {
            const target = w.id
              ? el.querySelector<HTMLElement>(
                  `.grid-stack-item[gs-id="${w.id}"]`
                )
              : null;
            if (target) grid.update(target, w);
          });
        } catch {}
      },
    };
  }, [mode, storageKey]);

  return api;
}
