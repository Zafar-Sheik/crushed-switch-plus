"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORIES, FLAVOURS, KIT_PRICE, POD_PRICE, WHATSAPP_NUMBER, podSrc, rand } from "@/lib/data";
import { useOrder } from "@/lib/order";
import { flyToCart } from "@/lib/fly";

export function Hero() {
  const [index, setIndex] = useState(0);
  const { addPod, setAccent } = useOrder();
  const podRef = useRef<HTMLDivElement>(null);
  const flavour = FLAVOURS[index];
  const cat = CATEGORIES.find((c) => c.id === flavour.category)!;

  useEffect(() => setAccent(flavour.color), [flavour.color, setAccent]);

  return (
    <section id="top" className="relative isolate overflow-hidden pb-24">
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background: `radial-gradient(45% 55% at 75% 50%, ${flavour.color}33, transparent 70%), radial-gradient(40% 40% at 10% 0%, #6a1fb840, transparent 70%), #07040c`,
        }}
      />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <Image src="/brand/logo-white.png" alt="Crushed Switch+" width={1400} height={446} priority className="h-auto w-36 sm:w-44" />
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider transition hover:bg-white hover:text-black"
        >
          Chat to us
        </a>
      </header>

      <div className="mx-auto mt-10 grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:mt-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">Refillable pod vapes · South Africa · 18+</p>
          <h1 className="display mt-5 text-[11vw] sm:text-6xl xl:text-7xl">
            One device.
            <br />
            <span className="text-zap">20+ flavours.</span>
            <br />
            <span className="text-[var(--accent)] transition-colors duration-700">Zero boring.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-white/70">
            Buy the device once, then click in a new pod whenever you want a new flavour. Simple, affordable, and it looks good in your pocket.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#order" className="rounded-full bg-white px-7 py-4 font-black uppercase italic text-black transition hover:bg-zap">
              Build your order
            </a>
            <a href="#flavours" className="rounded-full border border-white/20 px-7 py-4 font-bold uppercase italic transition hover:bg-white/10">
              See all flavours
            </a>
          </div>
          <dl className="mt-8 flex gap-8">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-white/50">Whole kit</dt>
              <dd className="display text-3xl">{rand(KIT_PRICE)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-white/50">Each pod</dt>
              <dd className="display text-3xl">{rand(POD_PRICE)}</dd>
            </div>
          </dl>
        </motion.div>

        {/* try-a-flavour panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/10 bg-panel/70 p-5 backdrop-blur sm:p-7"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Try a flavour</span>
            <span className="font-mono text-xs text-white/40">{index + 1} / {FLAVOURS.length}</span>
          </div>

          <div className="relative mt-4 flex h-64 items-end justify-center gap-4 sm:h-80">
            <div className="pointer-events-none absolute inset-x-10 bottom-0 h-1/2 rounded-full blur-3xl transition-colors duration-500" style={{ background: `${flavour.color}55` }} />
            <div className="relative h-[85%] aspect-[409/640]">
              <Image src="/products/device-black.webp" alt="Crushed Switch+ device" fill sizes="200px" priority className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,.6)]" />
            </div>
            <span className="display mb-[30%] text-4xl text-zap">+</span>
            <div ref={podRef} className="relative h-[72%] aspect-[300/640]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={flavour.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image src={podSrc(flavour.id)} alt={`${flavour.name} pod`} fill sizes="140px" className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,.6)]" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: flavour.color }}>{cat.name}</div>
              <div className="display mt-1 text-3xl sm:text-4xl">{flavour.name}</div>
            </div>
            <button
              onClick={() => { addPod(flavour.id); flyToCart(podSrc(flavour.id), podRef.current); }}
              className="rounded-full px-6 py-3 font-black uppercase italic text-black transition hover:brightness-110"
              style={{ background: flavour.color }}
            >
              Add pod · {rand(POD_PRICE)}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a flavour">
            {FLAVOURS.map((f, i) => (
              <button
                key={f.id}
                role="radio"
                aria-checked={i === index}
                aria-label={f.name}
                title={f.name}
                onClick={() => setIndex(i)}
                className={
                  "h-8 w-8 rounded-full border-2 transition " +
                  (i === index ? "scale-110 border-white" : "border-transparent hover:scale-110")
                }
                style={{ background: f.color }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
