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
        "flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105",
        className
      )}
    >
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-2xl shadow-sm text-white text-xl font-bold",
          color || "bg-gray-500"
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-white drop-shadow-md">
        {label}
      </span>
    </button>
  );
}
