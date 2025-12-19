"use client";

import React from "react";
import { useGridStack } from "@/hooks/use-gridstack";
import { AnniversaryWidget } from "./widgets/anniversary-widget";
import { AppIcon } from "./widgets/app-icon";
import { TestWidget } from "./widgets/test-widget";
import { Plus } from "lucide-react";
import { WidgetShell } from "@/components/widget-shell";

type Item = {
  id: string;
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
  { id: "anniversary", x: 0, y: 0, w: 6, h: 4, type: "widget" },

  // Row 1 Apps (Right of Anniversary)
  {
    id: "taobao",
    x: 6,
    y: 0,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "爱淘宝", color: "bg-[#FF5000]", iconContent: "淘" },
  },
  {
    id: "jd",
    x: 8,
    y: 0,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "京东商城", color: "bg-[#E1251B]", iconContent: "JD" },
  },
  {
    id: "metasota",
    x: 10,
    y: 0,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "秘塔写作猫", color: "bg-[#4E6EF2]", iconContent: "AI" },
  },

  // Row 2 Apps (Right of Anniversary)
  {
    id: "baidu",
    x: 6,
    y: 2,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "百度", color: "bg-[#2932E1]", iconContent: "du" },
  },
  {
    id: "tmall",
    x: 8,
    y: 2,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "天猫精选", color: "bg-[#FF0036]", iconContent: "猫" },
  },
  {
    id: "vip",
    x: 10,
    y: 2,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "唯品会", color: "bg-[#F10180]", iconContent: "唯" },
  },

  // Row 3 Apps (Below Anniversary)
  {
    id: "gaoding",
    x: 0,
    y: 4,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "稿定设计", color: "bg-[#0057FF]", iconContent: "稿" },
  },
  {
    id: "metaso_search",
    x: 2,
    y: 4,
    w: 2,
    h: 2,
    type: "app",
    data: {
      label: "秘塔AI搜索",
      color: "bg-white text-blue-600",
      iconContent: "metaso",
    },
  },
  {
    id: "ai_wind",
    x: 4,
    y: 4,
    w: 2,
    h: 2,
    type: "app",
    data: {
      label: "AI旋风",
      color: "bg-white text-purple-600",
      iconContent: "AI",
    },
  },

  // Add Button
  { id: "add_btn", x: 6, y: 4, w: 2, h: 2, type: "add" },
  // Tests Row (placed below existing apps, no overlap)
  { id: "test_widget", x: 0, y: 5, w: 3, h: 2, type: "widget" },
  {
    id: "test_a",
    x: 3,
    y: 5,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "测试A", color: "bg-[#6C5CE7]", iconContent: "A" },
  },
  {
    id: "test_b",
    x: 5,
    y: 5,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "测试B", color: "bg-[#00B894]", iconContent: "B" },
  },
  {
    id: "test_c",
    x: 7,
    y: 5,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "测试C", color: "bg-[#0984E3]", iconContent: "C" },
  },
  {
    id: "test_d",
    x: 9,
    y: 5,
    w: 2,
    h: 2,
    type: "app",
    data: { label: "测试D", color: "bg-[#E17055]", iconContent: "D" },
  },
];

export function DashboardCanvas() {
  const gridApi = useGridStack({
    storageKey: "desktop:gridstack-v4", // bump key to ensure new layout shows
    column: 12,
    cellHeight: 70, // Slightly taller for better proportions
    margin: 15,
  });

  const { containerRef, mode, guides } = gridApi; // consume guides for overlay

  return (
    <div className="relative min-h-[600px] w-full max-w-[1400px] mx-auto">
      <div className="grid-stack" ref={containerRef}>
        {items.map((item) => (
          <div
            key={item.id}
            className="grid-stack-item transition-all duration-150"
            gs-id={item.id}
            gs-x={item.x}
            gs-y={item.y}
            gs-w={item.w}
            gs-h={item.h}
            gs-no-resize={
              item.type === "app" || item.type === "add" ? "true" : "false"
            }
            data-fixed={item.id === "metaso_search" ? "true" : undefined}
            gs-no-move={item.id === "metaso_search" ? "true" : undefined}
          >
            <WidgetShell
              title={item.data?.label || ""}
              mode={mode}
              variant={item.type === "widget" ? "default" : "clean"}
            >
              {item.type === "widget" && item.id === "anniversary" && (
                <AnniversaryWidget />
              )}
              {item.type === "widget" && item.id === "test_widget" && (
                <TestWidget />
              )}

              {item.type === "app" && (
                <AppIcon
                  label={item.data!.label}
                  color={item.data!.color}
                  icon={item.data!.iconContent}
                  onClick={() => console.log("Open", item.data!.label)}
                />
              )}

              {item.type === "add" && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                  <div className="flex aspect-square h-[70%] min-h-0 max-w-[90%] items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md cursor-pointer text-white">
                    <Plus className="size-8 opacity-80" />
                  </div>
                  {/* Empty label spacer to align with apps */}
                  <span className="h-[16px] w-full"></span>
                </div>
              )}
            </WidgetShell>
          </div>
        ))}
        {guides.visible && (
          <div className="pointer-events-none absolute inset-0 z-[9999]">
            {guides.v.map((x) => (
              <div
                key={`v-${x}`}
                style={{ left: x }}
                className="absolute top-0 bottom-0 w-px bg-orange-400/70"
              />
            ))}
            {guides.h.map((y) => (
              <div
                key={`h-${y}`}
                style={{ top: y }}
                className="absolute left-0 right-0 h-px bg-orange-400/70"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
