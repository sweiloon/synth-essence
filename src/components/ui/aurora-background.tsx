"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col h-[100vh] items-center justify-center bg-background text-foreground transition-bg overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--aurora-color-1:hsl(var(--primary))]
            [--aurora-color-2:hsl(var(--secondary))]
            [--aurora-color-3:hsl(var(--accent))]
            [--aurora-color-4:hsl(var(--primary))]
            [--aurora-size:100%]
            [--aurora-position:50%_50%]
            [--aurora-blur:80px]
            `,
            "absolute -inset-[10px] opacity-50 blur-[80px] will-change-transform",
            "[background-image:repeating-linear-gradient(100deg,var(--aurora-color-1)_0%,var(--aurora-color-2)_10%,var(--aurora-color-3)_20%,var(--aurora-color-4)_30%,var(--aurora-color-1)_40%)]",
            "[background-size:300%,_200%]",
            "[background-position:50%_50%,50%_50%]",
            "animate-aurora"
          )}
        ></div>
      </div>
      {showRadialGradient && (
        <div
          className={cn(
            `
            [--aurora-gradient-from:transparent]
            [--aurora-gradient-via:hsl(var(--background))]
            [--aurora-gradient-to:hsl(var(--background))]
            `,
            "absolute inset-0 bg-[radial-gradient(circle_at_center,var(--aurora-gradient-from)_0%,var(--aurora-gradient-via)_40%,var(--aurora-gradient-to)_100%)]"
          )}
        ></div>
      )}
      {children}
    </div>
  );
};
