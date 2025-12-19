"use client";

import { cn } from "@/lib/utils";
import {
  User,
  Home,
  Sparkles,
  Briefcase,
  ShoppingBag,
  Settings,
  PlusCircle,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const navItems = [
    { icon: User, label: "我的", active: false }, // User avatar usually top, but let's put it in list if that's the design.
    // Actually typically User is top separate. Let's follow the previous code which had User separate.
    // Wait, the previous code had User separate.
    // Let's stick to a standard dock/sidebar layout.
    { icon: Home, label: "主页", active: true },
    { icon: Sparkles, label: "AI办公", active: false },
    { icon: Briefcase, label: "工具", active: false },
    { icon: ShoppingBag, label: "购物", active: false },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-16",
        "bg-background/60 backdrop-blur border-r border-border/40",
        "flex flex-col items-center justify-between py-4",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center gap-8">
        {/* User Avatar */}
        <div className="group relative flex size-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 cursor-pointer">
          <User className="size-5 text-white/90" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "group flex flex-col items-center gap-1 transition-all",
                item.active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl transition-all",
                  item.active
                    ? "bg-card/70 backdrop-blur shadow-glass"
                    : "group-hover:bg-card/60"
                )}
              >
                <item.icon
                  className={cn("size-5", item.active && "fill-current")}
                />
              </div>
              <span className="text-[10px] font-medium tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-6">
        <button className="group flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <div className="flex size-10 items-center justify-center rounded-2xl group-hover:bg-card/60 transition-all">
            <PlusCircle className="size-6" />
          </div>
        </button>
        <button className="group flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <div className="flex size-10 items-center justify-center rounded-2xl group-hover:bg-card/60 transition-all">
            <Settings className="size-6" />
          </div>
        </button>
      </div>
    </aside>
  );
}
