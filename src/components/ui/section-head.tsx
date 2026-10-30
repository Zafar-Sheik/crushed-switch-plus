"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function SectionHead({ tag, a, b, children, className, center }: {
  tag: string; a: string; b: string; children?: React.ReactNode; className?: string; center?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const split = SplitText.create(ref.current!.querySelectorAll(".sh-line"), { type: "chars", mask: "lines" });
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.015,
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
      gsap.from(ref.current!.querySelectorAll(".sh-fade"), {
        y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 82%" },
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
      <span className="sh-fade tag"><span>{tag}</span></span>
      <h2 className="display mt-5 text-5xl sm:text-7xl">
        <span className="sh-line block">{a}</span>
        <span className="sh-line block text-[var(--accent)] transition-colors duration-700">{b}</span>
      </h2>
      {children && <div className="sh-fade mt-6 text-lg text-white/70">{children}</div>}
    </div>
  );
}
