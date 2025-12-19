import { cn } from "@/lib/utils";

interface AppIconProps {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function AppIcon({
  label,
  icon,
  color,
  className,
  onClick,
}: AppIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden transition-transform hover:scale-105",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl bg-card/70 backdrop-blur shadow-glass text-2xl font-bold",
          color
        )}
      >
        {icon}
      </div>
      <span className="w-full truncate text-center text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </button>
  );
}
