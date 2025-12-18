"use client";

import { useEffect, useRef, useState } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import { AnniversaryWidget } from "./widgets/anniversary-widget";
import { AppIcon } from "./widgets/app-icon";
import { Plus } from "lucide-react";

type Item = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "widget" | "app" | "add";
  data?: {
    label: string;
    color: string;
    iconContent?: string | React.ReactNode;
  };
};

const items: Item[] = [
  // Big Anniversary Widget
  { i: "anniversary", x: 0, y: 0, w: 6, h: 4, type: "widget" },

  // Row 1 Apps
  {
    i: "taobao",
    x: 6,
    y: 0,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "爱淘宝", color: "bg-orange-500", iconContent: "淘" },
  },
  {
    i: "jd",
    x: 8,
    y: 0,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "京东商城", color: "bg-red-600", iconContent: "JD" },
  },
  {
    i: "metasota",
    x: 10,
    y: 0,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "秘塔写作猫", color: "bg-blue-600", iconContent: "AI" },
  },

  // Row 2 Apps
  {
    i: "baidu",
    x: 6,
    y: 2,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "百度", color: "bg-blue-500", iconContent: "du" },
  },
  {
    i: "tmall",
    x: 8,
    y: 2,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "天猫精选", color: "bg-red-500", iconContent: "猫" },
  },
  {
    i: "vip",
    x: 10,
    y: 2,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "唯品会", color: "bg-pink-600", iconContent: "唯" },
  },

  // Row 3 Apps
  {
    i: "gaoding",
    x: 0,
    y: 4,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "稿定设计", color: "bg-blue-600", iconContent: "稿" },
  },
  {
    i: "metaso",
    x: 2,
    y: 4,
    w: 2,
    h: 2,
    type: "app",
    data: {
      label: "秘塔AI搜索",
      color: "bg-white text-blue-600",
      iconContent: "so",
    },
  },
  {
    i: "aiwind",
    x: 4,
    y: 4,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "AI旋风", color: "bg-purple-600", iconContent: "M" },
  },
  { i: "add", x: 6, y: 4, w: 2, h: 2, type: "add" },
];

export function DashboardCanvas() {
  const [width, setWidth] = useState(1200);
  const ref = useRef<HTMLDivElement | null>(null);

  const initialLayout: Layout[] = items.map((it) => ({
    i: it.i,
    x: it.x,
    y: it.y,
    w: it.w,
    h: it.h,
    isDraggable: it.i !== "add",
    isResizable: false,
  })) as unknown as Layout[];

  const [layout, setLayout] = useState<Layout[]>(initialLayout);

  useEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const findNextPosition = (currentLayout: any[], w: number, h: number) => {
    const cols = 12;
    const occupied = new Set<string>();

    currentLayout.forEach((item) => {
      if (item.i === "add") return;
      for (let x = item.x; x < item.x + item.w; x++) {
        for (let y = item.y; y < item.y + item.h; y++) {
          occupied.add(`${x},${y}`);
        }
      }
    });

    let y = 0;
    while (true) {
      for (let x = 0; x <= cols - w; x++) {
        let fits = true;
        for (let dx = 0; dx < w; dx++) {
          for (let dy = 0; dy < h; dy++) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }
        if (fits) return { x, y };
      }
      y++;
    }
  };

  const handleLayoutChange = (newLayout: Layout) => {
    const layoutItems = newLayout as unknown as any[];

    const addItem = layoutItems.find((i: any) => i.i === "add");
    if (!addItem) return;

    const otherItems = layoutItems.filter((i: any) => i.i !== "add");
    const nextPos = findNextPosition(otherItems, addItem.w, addItem.h);

    const finalLayout = layoutItems.map((item: any) => {
      if (item.i === "add") {
        return {
          ...item,
          x: nextPos.x,
          y: nextPos.y,
          isDraggable: false,
        };
      }
      return {
        ...item,
        isDraggable: true,
      };
    }) as unknown as Layout[];

    // Only update if changed to avoid loops
    if (JSON.stringify(finalLayout) !== JSON.stringify(layout)) {
      setLayout(finalLayout);
    }
  };

  return (
    <div ref={ref} className="w-full max-w-[1000px] mx-auto">
      <GridLayout
        className="layout"
        layout={layout as unknown as Layout}
        gridConfig={{
          cols: 12,
          rowHeight: 60,
          margin: [20, 20],
        }}
        width={width}
        onLayoutChange={handleLayoutChange}
      >
        {items.map((it) => (
          <div key={it.i} className="flex items-center justify-center p-1">
            {it.type === "widget" && it.i === "anniversary" && (
              <AnniversaryWidget />
            )}

            {it.type === "app" && it.data && (
              <AppIcon
                label={it.data.label}
                color={it.data.color}
                icon={it.data.iconContent}
                className="w-full h-full"
              />
            )}

            {it.type === "add" && (
              <AppIcon
                label=""
                color="bg-white/20 backdrop-blur-sm"
                icon={<Plus className="text-white" />}
                className="w-full h-full"
              />
            )}
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
