"use client";

import { Plus } from "lucide-react";
import { AppIcon } from "./app-icon";

interface AddWidgetProps {
  onAdd?: () => void;
}

export function AddWidget({ onAdd }: AddWidgetProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <button onClick={onAdd} className="w-full h-full">
        <AppIcon
          label=""
          color="bg-white/20 backdrop-blur-sm"
          icon={<Plus className="text-white" />}
          className="w-full h-full"
        />
      </button>
    </div>
  );
}

