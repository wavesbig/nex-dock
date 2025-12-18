"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useStore } from "zustand"
import { networkStore } from "@/lib/stores/network-store"
import { Switch } from "@/components/ui/switch"

export function SettingsSheet() {
  const intranet = useStore(networkStore, (s) => s.intranet)
  const toggle = useStore(networkStore, (s) => s.toggle)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          ⚙️
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">内外网模式</div>
            <Switch checked={intranet} onCheckedChange={toggle} />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const el = document.documentElement
              el.classList.toggle("dark")
            }}
          >
            切换主题
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

