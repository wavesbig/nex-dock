import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-background px-4 text-sm placeholder:text-muted-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }

