"use client";

import { useEffect, useRef } from "react";
import { GridStack } from "gridstack";

const items = [
  { id: "a", x: 0, y: 0, w: 4, h: 2, content: "A" },
  { id: "b", x: 4, y: 0, w: 4, h: 3, content: "B" },
  { id: "c", x: 8, y: 0, w: 4, h: 2, content: "C" },
];

export function GridLayoutDemo() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstanceRef = useRef<GridStack | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    // Check if already initialized to prevent double init in Strict Mode
    if (gridInstanceRef.current) return;

    const grid = GridStack.init(
      {
        column: 12,
        cellHeight: 30,
        margin: 10,
        float: true,
      },
      gridRef.current
    );
    
    gridInstanceRef.current = grid;

    return () => {
      // Cleanup
      if (gridInstanceRef.current) {
        gridInstanceRef.current.destroy(false);
        gridInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        gridstack demo (drag/resize)
      </div>
      <div className="grid-stack" ref={gridRef}>
        {items.map((item) => (
          <div
            key={item.id}
            className="grid-stack-item"
            gs-x={item.x}
            gs-y={item.y}
            gs-w={item.w}
            gs-h={item.h}
            gs-id={item.id}
          >
            <div className="grid-stack-item-content rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
