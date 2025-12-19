"use client";

import { cn } from "@/lib/utils";
import {
  User,
  Home,
  Bot,
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
    { icon: Home, label: "主页", active: true },
    { icon: Bot, label: "AI办公" },
    { icon: Briefcase, label: "工具" },
    { icon: ShoppingBag, label: "购物" },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen w-[80px] flex-col items-center justify-between py-6",
        "bg-black/20 backdrop-blur-md border-r border-white/10",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8">
        {/* User Avatar */}
        <div className="flex size-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors cursor-pointer">
          <User className="size-5 text-white" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "group flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors",
                item.active && "text-white"
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-all",
                  item.active ? "bg-white/20" : "group-hover:bg-white/10"
                )}
              >
                <item.icon className="size-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button className="text-white/70 hover:text-white transition-colors">
          <PlusCircle className="size-6" />
        </button>
        <button className="text-white/70 hover:text-white transition-colors">
          <Settings className="size-6" />
        </button>
      </div>
    </aside>
  );
}
