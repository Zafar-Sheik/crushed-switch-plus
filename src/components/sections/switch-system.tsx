"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { podSrc } from "@/lib/data";
import { SectionHead } from "../ui/section-head";

const STEPS = [
  {
    n: "01",
    t: "Get the kit",
    d: "Start with the whole kit for R150: the device plus your first pod.",
    visual: (
      <div className="flex h-full items-end justify-center gap-2">
        <div className="relative h-[90%] aspect-[409/640]"><Image src="/products/device-black.webp" alt="" fill sizes="120px" className="object-contain" /></div>
        <div className="relative h-[75%] aspect-[300/640]"><Image src={podSrc("miami-mint")} alt="" fill sizes="80px" className="object-contain" /></div>
      </div>
    ),
  },
  {
    n: "02",
    t: "Pick a flavour",
    d: "Choose from 20+ flavours. Go fruity, icy, minty or energy.",
    visual: (
      <div className="flex h-full items-end justify-center">
        {["mexican-mango", "cherry-slush", "blue-razz"].map((id, i) => (
          <div key={id} className="relative -mx-2 h-[80%] aspect-[300/640]" style={{ transform: `rotate(${(i - 1) * 10}deg)` }}>
            <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-y-2" style={{ transitionDelay: `${i * 50}ms` }}>
              <Image src={podSrc(id)} alt="" fill sizes="80px" className="object-contain" />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    t: "Switch it up",
    d: "When a pod runs out, or you want a change, click in a new one for R90.",
    visual: (
      <div className="flex h-full items-end justify-center gap-3">
        <div className="relative h-[75%] aspect-[300/640] opacity-40"><Image src={podSrc("sour-apple")} alt="" fill sizes="80px" className="object-contain" /></div>
        <span className="mb-[25%] text-3xl text-zap">⇄</span>
        <div className="relative h-[75%] aspect-[300/640]"><Image src={podSrc("grape-ice")} alt="" fill sizes="80px" className="object-contain" /></div>
      </div>
    ),
  },
];

export function SwitchSystem() {
  return (
    <section id="switch" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead tag="The Switch+ system" a="Swap flavours" b="in seconds.">
          One rechargeable device with a digital display, and a click-in pod you can change whenever you want to try a different flavour.
        </SectionHead>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="group rounded-3xl border border-white/10 bg-panel p-6 transition-colors hover:border-white/25"
            >
              <div className="h-44 rounded-2xl bg-black/30 p-4">{s.visual}</div>
              <div className="mt-6 flex items-baseline gap-4">
                <span className="display text-outline text-4xl text-[var(--accent)]">{s.n}</span>
                <h3 className="display text-2xl">{s.t}</h3>
              </div>
              <p className="mt-2 text-white/65">{s.d}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
