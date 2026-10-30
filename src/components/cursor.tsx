"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** A two-part cursor: a sharp dot and a lagging, flavour-tinted halo that grows over interactive things. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const xh = gsap.quickTo(halo.current, "x", { duration: 0.45, ease: "power3" });
    const yh = gsap.quickTo(halo.current, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      xd(e.clientX); yd(e.clientY); xh(e.clientX); yh(e.clientY);
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor],a,button,input,textarea,select,label") as HTMLElement | null;
      const text = t?.dataset.cursor ?? "";
      const big = !!t;
      gsap.to(halo.current, { scale: text ? 2.6 : big ? 1.7 : 1, duration: 0.3 });
      if (label.current) label.current.textContent = text;
    };
    const down = () => gsap.to(halo.current, { scale: "*=0.75", duration: 0.15 });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000] hidden [@media(pointer:fine)]:block" aria-hidden>
      <div ref={halo} className="absolute -left-5 -top-5 grid h-10 w-10 place-items-center rounded-full border border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] mix-blend-screen">
        <span ref={label} className="text-[5px] font-black uppercase italic tracking-wider text-white" />
      </div>
      <div ref={dot} className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white" />
    </div>
  );
}
