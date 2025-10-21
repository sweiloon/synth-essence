import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative flex w-full items-center justify-center bg-background", className)}>
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
}
