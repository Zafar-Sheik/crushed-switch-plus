"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { DEVICES, KIT_PRICE, deviceSrc, rand } from "@/lib/data";
import { useOrder } from "@/lib/order";
import { flyToCart } from "@/lib/fly";
import { CardContainer, CardItem } from "../ui/card-3d";
import { SectionHead } from "../ui/section-head";
import { cn } from "@/lib/utils";

const FEATURES = [
  { t: "Digital display", d: "A clear on-screen readout, so you're not left guessing." },
  { t: "Click-in pods", d: "Every pod fits every device. Mix and match freely." },
  { t: "Pocket-sized", d: "A compact, rounded body that's easy to carry." },
];

/** Lamp-lit showroom: pick a colourway and the light, glow and device all change together. */
export function Colourways() {
  const [sel, setSel] = useState(0);
  const d = DEVICES[sel];
  const imgRef = useRef<HTMLDivElement>(null);
  const { addKit } = useOrder();

  return (
    <section id="colourways" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead tag="The device" a="Pick your" b="colourway." center>
          A compact box design with a big digital display. Choose the colour that suits your style, then pair it with any pod.
        </SectionHead>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-5xl flex-col items-center">
        {/* lamp */}
        <div className="pointer-events-none relative h-40 w-full">
          <motion.div
            animate={{ background: `conic-gradient(from 70deg at center top, ${d.glow}, transparent 40%)` }}
            className="absolute right-1/2 top-0 h-56 w-[24rem] max-w-[50vw] [mask-image:linear-gradient(to_bottom,white,transparent)]"
          />
          <motion.div
            animate={{ background: `conic-gradient(from 250deg at center top, transparent 60%, ${d.glow})` }}
            className="absolute left-1/2 top-0 h-56 w-[24rem] max-w-[50vw] [mask-image:linear-gradient(to_bottom,white,transparent)]"
          />
          <motion.div animate={{ backgroundColor: d.glow }} className="absolute left-1/2 top-0 h-1 w-[28rem] max-w-[80vw] -translate-x-1/2 rounded-full shadow-[0_0_40px_10px] blur-[1px]" style={{ color: d.glow }} />
          <motion.div animate={{ backgroundColor: d.glow }} className="absolute left-1/2 top-0 h-24 w-[22rem] max-w-[70vw] -translate-x-1/2 rounded-full opacity-40 blur-3xl" />
        </div>

        <CardContainer intensity={14} containerClassName="-mt-24">
          <CardItem z={60}>
            <div ref={imgRef} className="relative h-[340px] w-[260px] sm:h-[460px] sm:w-[320px]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  className="absolute inset-0"
                >
                  <Image src={deviceSrc(d.id)} alt={`Crushed Switch+ device in ${d.name}`} fill sizes="320px" className="object-contain drop-shadow-[0_50px_40px_rgba(0,0,0,.7)]" />
                </motion.div>
              </AnimatePresence>
            </div>
          </CardItem>
        </CardContainer>
        <div className="-mt-6 h-10 w-72 rounded-[100%] blur-2xl transition-colors duration-500" style={{ background: `${d.glow}66` }} />

        <AnimatePresence mode="wait">
          <motion.h3
            key={d.name}
            initial={{ y: 20, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(8px)" }}
            className="display mt-6 text-5xl sm:text-7xl"
            style={{ color: d.glow }}
          >
            {d.name}
          </motion.h3>
        </AnimatePresence>

        <div className="mt-8 flex gap-4" role="radiogroup" aria-label="Device colour">
          {DEVICES.map((dv, i) => (
            <button
              key={dv.id}
              role="radio"
              aria-checked={i === sel}
              aria-label={dv.name}
              onClick={() => setSel(i)}
              className={cn(
                "relative h-14 w-14 rounded-full border-2 transition-all duration-300 hover:scale-110",
                i === sel ? "scale-110 border-white" : "border-white/20"
              )}
              style={{ background: dv.color, boxShadow: i === sel ? `0 0 30px ${dv.glow}` : undefined }}
            >
              {i === sel && <motion.span layoutId="ring" className="absolute -inset-2 rounded-full border-2" style={{ borderColor: dv.glow }} />}
            </button>
          ))}
        </div>

        <button
          onClick={() => { addKit(d.id, d.pod); flyToCart(deviceSrc(d.id), imgRef.current); }}
          className="mt-8 rounded-full bg-white px-8 py-4 font-black uppercase italic text-black transition hover:scale-105"
          style={{ boxShadow: `0 0 50px ${d.glow}77` }}
        >
          Add {d.name} kit · {rand(KIT_PRICE)}
        </button>
        <p className="mt-3 text-sm text-white/50">Kit includes one pod. Change the flavour in your stack below.</p>
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-5 px-5 sm:px-8 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <div key={f.t} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-7">
            <span className="display absolute -right-2 -top-4 text-8xl text-white/[0.04] transition group-hover:text-white/[0.08]">0{i + 1}</span>
            <h4 className="display text-2xl transition-colors duration-500" style={{ color: d.glow }}>{f.t}</h4>
            <p className="mt-2 text-white/65">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
