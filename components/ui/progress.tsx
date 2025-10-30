"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-slate-700 relative h-2.5 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 transition-all duration-500 ease-out"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: 'var(--progress-indicator, linear-gradient(to right, #10b981, #14b8a6))'
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
