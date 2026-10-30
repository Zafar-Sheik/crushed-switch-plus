"use client";

import { cn } from "@/lib/utils";

/** Aceternity-style moving border: a conic beam that orbits the card edge. */
export function MovingBorder({ children, className, color = "#b45cff", duration = 5, radius = "1.75rem" }: {
  children: React.ReactNode; className?: string; color?: string; duration?: number; radius?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden p-[2px]", className)} style={{ borderRadius: radius }}>
      <div
        className="absolute inset-[-100%] animate-spin-slow"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 70%, ${color} 85%, transparent 100%)`,
          animationDuration: `${duration}s`,
        }}
      />
      <div className="relative h-full bg-panel" style={{ borderRadius: `calc(${radius} - 2px)` }}>
        {children}
      </div>
    </div>
  );
}
