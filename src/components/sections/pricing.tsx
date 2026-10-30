"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { KIT_PRICE, POD_PRICE } from "@/lib/data";
import { SectionHead } from "../ui/section-head";
import { MovingBorder } from "../ui/moving-border";
import { SevenSeg } from "../ui/seven-seg";
import { cn } from "@/lib/utils";

function useTween(value: number) {
  const [v, setV] = useState(value);
  const o = useRef({ v: value });
  useEffect(() => {
    const t = gsap.to(o.current, { v: value, duration: 0.6, ease: "power3.out", onUpdate: () => setV(Math.round(o.current.v)) });
    return () => { t.kill(); };
  }, [value]);
  return v;
}

export function Pricing() {
  const [extra, setExtra] = useState(1);
  const [haveDevice, setHaveDevice] = useState(false);
  const total = (haveDevice ? 0 : KIT_PRICE) + extra * POD_PRICE;
  const shown = useTween(total);
  const podsTotal = (haveDevice ? 0 : 1) + extra;

  return (
    <section id="pricing" className="relative py-28 sm:py-36">
      <div className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-zap/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead tag="Pricing" a="Simple prices." b="No surprises.">
          Two prices to remember. Start with the kit, then keep going with pods.
        </SectionHead>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <MovingBorder color="#ffd60a" duration={4}>
            <div className="relative overflow-hidden p-7 sm:p-9">
              <div className="absolute -right-12 top-7 rotate-45 bg-zap px-14 py-1 text-xs font-black uppercase italic tracking-widest text-black">Start here</div>
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0 rounded-2xl bg-white/95"><Image src="/products/device-blue.webp" alt="" fill sizes="96px" className="object-contain p-2" /></div>
                <div>
                  <h3 className="display text-3xl">1 Whole kit</h3>
                  <p className="font-bold uppercase tracking-wider text-white/50">Device + 1 pod</p>
                </div>
              </div>
              <div className="display mt-6 text-8xl text-zap">R150</div>
              <ul className="mt-6 divide-y divide-dashed divide-white/10 border-t border-dashed border-white/10">
                {["Rechargeable Switch+ device", "One flavour pod of your choice", "Digital display"].map((x) => (
                  <li key={x} className="flex items-center gap-3 py-3 text-white/80"><span className="text-zap">◆</span>{x}</li>
                ))}
              </ul>
            </div>
          </MovingBorder>
          <MovingBorder color="#b45cff" duration={6}>
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0 rounded-2xl bg-white/95"><Image src="/products/mexican-mango.webp" alt="" fill sizes="96px" className="object-contain p-2" /></div>
                <div>
                  <h3 className="display text-3xl">Each pod</h3>
                  <p className="font-bold uppercase tracking-wider text-white/50">Any flavour</p>
                </div>
              </div>
              <div className="display mt-6 bg-gradient-to-r from-[#c58bff] to-[#9b3dff] bg-clip-text text-8xl text-transparent">R90</div>
              <ul className="mt-6 divide-y divide-dashed divide-white/10 border-t border-dashed border-white/10">
                {["Fits every Switch+ device", "20+ flavours to choose from", "Click in and go"].map((x) => (
                  <li key={x} className="flex items-center gap-3 py-3 text-white/80"><span className="text-grape">◆</span>{x}</li>
                ))}
              </ul>
            </div>
          </MovingBorder>
        </div>

        {/* calculator */}
        <div className="mt-6 grid gap-6 rounded-[1.75rem] border border-white/10 bg-panel p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="display text-3xl">Stack calculator</h3>
              <div className="flex rounded-full border border-white/10 p-1 text-xs font-bold uppercase">
                {[false, true].map((v) => (
                  <button key={String(v)} onClick={() => setHaveDevice(v)} className={cn("rounded-full px-3 py-1.5 transition", haveDevice === v ? "bg-white text-black" : "text-white/60")}>
                    {v ? "I have a device" : "I need a kit"}
                  </button>
                ))}
              </div>
            </div>
            <label className="mt-6 block">
              <span className="flex justify-between text-sm font-bold uppercase tracking-wider text-white/60">
                <span>Extra pods</span><span className="text-white">{extra}</span>
              </span>
              <input
                type="range"
                min={haveDevice ? 1 : 0}
                max={12}
                value={Math.max(extra, haveDevice ? 1 : 0)}
                onChange={(e) => setExtra(+e.target.value)}
                className="mt-3 w-full accent-[var(--accent)]"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: podsTotal }).map((_, i) => (
                <span key={i} className="h-7 w-4 rounded-sm bg-[var(--accent)] transition-all" style={{ opacity: 1 - i * 0.04 }} />
              ))}
            </div>
            <p className="mt-3 text-sm text-white/50">
              {haveDevice ? "" : "R150 kit"}{!haveDevice && extra > 0 ? " + " : ""}{extra > 0 ? `${extra} × R90 pods` : ""} = {podsTotal} flavour{podsTotal === 1 ? "" : "s"} to switch between
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-black/60 p-6 text-[var(--accent)]">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">Total (ZAR)</span>
            <div className="flex items-center gap-2">
              <span className="display text-5xl text-white/80">R</span>
              <SevenSeg value={shown} pad={4} className="h-20" />
            </div>
            <a href="#order" className="rounded-full bg-[var(--accent)] px-6 py-3 font-black uppercase italic text-black transition hover:scale-105">Build this stack →</a>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[["R150", "Kit to get started"], ["R240", "Kit + 1 extra pod"], ["R330", "Kit + 2 extra pods"]].map(([p, l], i) => (
            <button key={p} onClick={() => { setHaveDevice(false); setExtra(i); }} className="rounded-2xl border border-white/10 bg-panel p-4 transition hover:-translate-y-1 hover:border-[var(--accent)] sm:p-6">
              <div className="display text-3xl sm:text-4xl">{p}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs">{l}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
