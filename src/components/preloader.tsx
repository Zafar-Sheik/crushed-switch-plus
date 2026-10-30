"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { SevenSeg } from "./ui/seven-seg";

/**
 * Boot sequence styled on the device's digital display, followed by the 18+ gate.
 * The gate is remembered per browser so returning adults go straight in.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [stage, setStage] = useState<"boot" | "gate" | "denied" | "done">("boot");

  const exit = () => {
    try { localStorage.setItem("cs-18", "yes"); } catch {}
    const tl = gsap.timeline({
      onComplete: () => {
        setStage("done");
        document.documentElement.style.overflow = "";
        (window as unknown as { lenis?: { start(): void } }).lenis?.start();
        window.dispatchEvent(new Event("cs:ready"));
      },
    });
    tl.to(".pl-inner", { scale: 0.85, opacity: 0, duration: 0.45, ease: "power3.in" })
      .to(".pl-panel", { yPercent: (i) => (i % 2 ? 100 : -100), duration: 0.9, ease: "expo.inOut", stagger: 0.06 }, "-=0.1");
  };

  useEffect(() => {
    let verified = false;
    try { verified = localStorage.getItem("cs-18") === "yes"; } catch {}
    const lenis = (window as unknown as { lenis?: { stop(): void } }).lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const o = { v: 0 };
    const tw = gsap.to(o, {
      v: 100,
      duration: verified ? 1.1 : 1.6,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(o.v)),
      onComplete: () => (verified ? exit() : setStage("gate")),
    });
    return () => { tw.kill(); };
  }, []);

  if (stage === "done") return null;

  return (
    <div ref={root} className="fixed inset-0 z-[9000]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="pl-panel absolute top-0 h-full bg-[#0b0614]"
          style={{ left: `${(i * 100) / 6}%`, width: `calc(${100 / 6}% + 1px)` }}
        />
      ))}
      <div className="pl-inner absolute inset-0 grid place-items-center p-6">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <Image src="/brand/logo-white.png" alt="Crushed Switch+" width={1400} height={446} priority className="w-64 sm:w-80" />

          {stage === "boot" && (
            <div className="mt-10 flex flex-col items-center gap-4 text-[var(--accent)]">
              <SevenSeg value={pct} pad={3} className="h-16" />
              <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-[var(--accent)] shadow-[0_0_20px_var(--accent)]" style={{ width: `${pct}%` }} />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/50">Charging flavour</p>
            </div>
          )}

          {stage === "gate" && (
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-zap text-3xl font-black text-zap shadow-[0_0_60px_#ffd60a55]">
                18+
              </div>
              <div>
                <h2 className="display text-4xl">Adults only.</h2>
                <p className="mt-3 text-sm text-white/60">
                  Crushed Switch+ products are sold only to persons aged 18 and over. Vaping products may contain nicotine, which is addictive.
                </p>
              </div>
              <div className="flex w-full gap-3">
                <button onClick={exit} className="flex-1 rounded-full bg-grape px-6 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:shadow-[0_0_40px_#b45cff]">
                  I&apos;m 18 or older
                </button>
                <button onClick={() => setStage("denied")} className="flex-1 rounded-full border border-white/20 px-6 py-4 font-bold uppercase italic text-white/70 transition hover:bg-white/5">
                  I&apos;m under 18
                </button>
              </div>
            </div>
          )}

          {stage === "denied" && (
            <div className="mt-10">
              <h2 className="display text-4xl text-zap">Sorry, not yet.</h2>
              <p className="mt-3 text-white/60">This site is for adults 18 and over. Come back when you&apos;re of age.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
