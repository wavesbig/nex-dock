"use client"

import { useEffect, useRef, useState } from "react"
import GridLayout, { type Layout } from "react-grid-layout"
import { useStore } from "zustand"
import { networkStore } from "@/lib/stores/network-store"

type Item = {
  i: string
  x: number
  y: number
  w: number
  h: number
  title: string
  scope: "internet" | "intranet" | "both"
}

const base: Item[] = [
  { i: "jd", x: 0, y: 0, w: 2, h: 2, title: "京东", scope: "internet" },
  { i: "taobao", x: 2, y: 0, w: 2, h: 2, title: "淘宝", scope: "internet" },
  { i: "wiki", x: 4, y: 0, w: 2, h: 2, title: "内网知识库", scope: "intranet" },
  { i: "mail", x: 6, y: 0, w: 2, h: 2, title: "邮箱", scope: "both" },
  { i: "docs", x: 8, y: 0, w: 2, h: 2, title: "文档", scope: "both" },
  { i: "cloud", x: 10, y: 0, w: 2, h: 2, title: "云盘", scope: "both" },
]

export function DashboardCanvas() {
  const intranet = useStore(networkStore, (s) => s.intranet)
  const [width, setWidth] = useState(900)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (ref.current) ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const items = base.filter((it) =>
    intranet ? it.scope !== "internet" : it.scope !== "intranet"
  )

  const layout: Layout = items.map((it) => ({ i: it.i, x: it.x, y: it.y, w: it.w, h: it.h }))

  return (
    <div ref={ref} className="w-full">
      <GridLayout className="layout" layout={layout} gridConfig={{ cols: 12, rowHeight: 36, margin: [14, 14] as const }} width={width}>
        {items.map((it) => (
          <div key={it.i} className="rounded-xl border bg-card p-4 text-center text-sm">
            {it.title}
          </div>
        ))}
      </GridLayout>
    </div>
  )
}

