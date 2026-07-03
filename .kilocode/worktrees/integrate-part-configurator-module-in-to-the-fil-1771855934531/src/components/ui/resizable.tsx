"use client"

import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

// Simple types for resizable panels
type PanelGroupProps = ComponentPropsWithoutRef<"div"> & {
  direction?: "horizontal" | "vertical"
}

type PanelProps = ComponentPropsWithoutRef<"div">

type PanelResizeHandleProps = ComponentPropsWithoutRef<"div"> & {
  withHandle?: boolean
  direction?: "horizontal" | "vertical"
}

const ResizablePanelGroup = ({
  className,
  direction = "horizontal",
  ...props
}: PanelGroupProps) => (
  <div
    className={cn(
      "flex h-full w-full",
      direction === "vertical" ? "flex-col" : "",
      className
    )}
    data-panel-group-direction={direction}
    {...props}
  />
)

const ResizablePanel = ({
  className,
  ...props
}: PanelProps) => (
  <div className={cn("flex h-full w-full", className)} {...props} />
)

const ResizableHandle = ({
  withHandle,
  className,
  direction = "horizontal",
  ...props
}: PanelResizeHandleProps) => (
  <div
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      direction === "vertical" ? "h-px w-full after:left-0 after:h-1 after:w-full after:-translate-y-1/2 after:translate-x-0" : "",
      className
    )}
    data-panel-group-direction={direction}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
