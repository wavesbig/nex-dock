"use client";

import type { Layout } from "react-grid-layout";
import GridLayout from "react-grid-layout";

const layout: Layout = [
  { i: "a", x: 0, y: 0, w: 4, h: 2 },
  { i: "b", x: 4, y: 0, w: 4, h: 3 },
  { i: "c", x: 8, y: 0, w: 4, h: 2 },
];

export function GridLayoutDemo() {
  return (
    <div className="w-full">
      <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
        react-grid-layout demo (drag/resize)
      </div>
      <GridLayout
        className="layout"
        layout={layout}
        gridConfig={{ cols: 12, rowHeight: 30, margin: [10, 10] as const }}
        width={900}
      >
        <div
          key="a"
          className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          A
        </div>
        <div
          key="b"
          className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          B
        </div>
        <div
          key="c"
          className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          C
        </div>
      </GridLayout>
    </div>
  );
}
