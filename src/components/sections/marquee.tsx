"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FLAVOURS } from "@/lib/data";

/** Two skewed ribbons of flavour names whose speed and direction react to scroll velocity. */
export function FlavourMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".mq-row");
      const tweens = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1 })
      );
      let dir = 1;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          dir = self.direction;
          tweens.forEach((t) => {
            gsap.to(t, { timeScale: dir * Math.min(6, 1 + Math.abs(v) / 400), duration: 0.2, overwrite: true });
            gsap.to(t, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
          });
          gsap.to(".mq-skew", { skewY: gsap.utils.clamp(-6, 6, v / -300), duration: 0.4, overwrite: true });
        },
      });
    },
    { scope: root }
  );

  const names = [...FLAVOURS, ...FLAVOURS];
  return (
    <div ref={root} className="relative z-10 -my-6 overflow-hidden py-10">
      <div className="mq-skew -rotate-2">
        <div className="bg-[var(--accent)] py-3 transition-colors duration-700">
          <div className="mq-row flex w-max gap-10 whitespace-nowrap">
            {names.map((f, i) => (
              <span key={i} className="display flex items-center gap-10 text-3xl text-black sm:text-5xl">
                {f.name}
                <span className="text-2xl">✦</span>
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 rotate-3 border-y border-white/10 bg-black py-3">
          <div className="mq-row flex w-max gap-10 whitespace-nowrap">
            {names.map((f, i) => (
              <span key={i} className="display flex items-center gap-10 text-3xl sm:text-5xl">
                <span className="text-outline" style={{ color: f.color }}>{f.name}</span>
                <span className="text-white/30">+</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
