"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Aceternity-style card whose border and surface light up under the pointer. */
export function CardSpotlight({ children, className, color = "var(--accent)" }: {
  children: React.ReactNode; className?: string; color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-panel/80 p-7 backdrop-blur",
        className
      )}
      style={{ ["--spot" as string]: color }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(380px circle at var(--mx) var(--my), color-mix(in srgb, var(--spot) 28%, transparent), transparent 65%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
