"use client";

import { createContext, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MouseCtx = createContext<boolean>(false);

/** Aceternity "3D card effect": tilts toward the pointer, children pop out on translateZ. */
export function CardContainer({ children, className, containerClassName, intensity = 22 }: {
  children: React.ReactNode; className?: string; containerClassName?: string; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / intensity;
    const y = (e.clientY - r.top - r.height / 2) / intensity;
    el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };
  const onLeave = () => {
    setHover(false);
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseCtx.Provider value={hover}>
      <div className={cn("flex items-center justify-center", containerClassName)} style={{ perspective: "1000px" }}>
        <div
          ref={ref}
          onPointerEnter={() => setHover(true)}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className={cn("relative transition-transform duration-200 ease-out [transform-style:preserve-3d]", className)}
        >
          {children}
        </div>
      </div>
    </MouseCtx.Provider>
  );
}

export function CardItem({ children, className, z = 0, rotateZ = 0, as: Tag = "div" }: {
  children: React.ReactNode; className?: string; z?: number; rotateZ?: number; as?: React.ElementType;
}) {
  const hover = useContext(MouseCtx);
  return (
    <Tag
      className={cn("transition-transform duration-300 ease-out", className)}
      style={{ transform: hover ? `translateZ(${z}px) rotateZ(${rotateZ}deg)` : "translateZ(0) rotateZ(0)" }}
    >
      {children}
    </Tag>
  );
}
