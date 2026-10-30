"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORIES, FLAVOURS, POD_PRICE, podSrc, rand, type CategoryId, type Flavour } from "@/lib/data";
import { useOrder } from "@/lib/order";
import { flyToCart } from "@/lib/fly";
import { SectionHead } from "../ui/section-head";
import { cn } from "@/lib/utils";

type Filter = "all" | CategoryId;

export function FlavourLibrary() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      FLAVOURS.filter(
        (f) =>
          (filter === "all" || f.category === filter) &&
          (!q || `${f.name} ${f.notes.join(" ")}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [filter, q]
  );

  const tabs: { id: Filter; name: string; n: number }[] = [
    { id: "all", name: "All", n: FLAVOURS.length },
    ...CATEGORIES.map((c) => ({ id: c.id, name: c.name, n: FLAVOURS.filter((f) => f.category === c.id).length })),
  ];

  return (
    <section id="flavours" className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead tag="The flavour library" a="Find your" b="flavour.">
            {FLAVOURS.length} flavours and counting. Tap any pod to drop it straight into your stack.
          </SectionHead>
          <label className="relative block w-full max-w-sm">
            <span className="sr-only">Search flavours</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search… mango, ice, berry"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3.5 pl-12 text-white placeholder:text-white/35 outline-none transition focus:border-[var(--accent)] focus:bg-white/10"
            />
            <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          </label>
        </div>

        <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold uppercase italic tracking-wide transition",
                filter === t.id ? "text-black" : "text-white/70 hover:text-white"
              )}
            >
              {filter === t.id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[var(--accent)]" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
              <span className="relative">{t.name} <span className="opacity-60">{t.n}</span></span>
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {list.map((f) => (
              <FlavourCard key={f.id} f={f} />
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && <p className="mt-10 text-center text-white/50">No flavour matches “{q}”. Try “ice” or “berry”.</p>}

        <div className="relative mt-16 overflow-hidden rounded-3xl border-2 border-grape shadow-[0_0_60px_-15px_#b45cff]">
          <Image src="/brand/rainbow.jpg" alt="The classics line-up: Strawberry Blast, Watermelon Ice, Mango Ice, Pineapple Ice, Green Apple, Blue Razz, Grape Ice, Cola, Vanilla Custard, Mint Ice" width={853} height={215} className="h-auto w-full" sizes="(min-width:1280px) 1216px, 100vw" />
        </div>
      </div>
    </section>
  );
}

function FlavourCard({ f }: { f: Flavour }) {
  const { addPod, podQty } = useOrder();
  const qty = podQty(f.id);
  const ref = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const cat = CATEGORIES.find((c) => c.id === f.category)!;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    if (img.current) img.current.style.transform = `translate3d(0, -6px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
    if (img.current) img.current.style.transform = "";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-panel transition-[transform,border-color] sm:rounded-3xl duration-200 ease-out hover:border-white/25"
        style={{ ["--c" as string]: f.color }}
      >
        <div className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(80% 60% at 50% 35%, ${f.color}66, transparent 70%)` }} />
        <button
          onClick={() => { addPod(f.id); flyToCart(podSrc(f.id), img.current); }}
          className="relative block w-full text-left"
         
          aria-label={`Add ${f.name} pod to your order`}
        >
          <div className="relative flex h-28 items-end justify-center pt-3 sm:h-56 sm:pt-6">
            <div ref={img} className="relative h-full w-1/2 transition-transform duration-300 ease-out">
              <Image src={podSrc(f.id)} alt={`${f.name} pod`} fill sizes="160px" className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,.55)]" />
            </div>
          </div>
          <div className="relative p-2.5 pt-2 sm:p-4 sm:pt-3">
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:block">{cat.name}</div>
            <h3 className="line-clamp-2 min-h-[2.4em] text-[11px] font-black uppercase leading-tight sm:mt-1 sm:min-h-0 sm:text-lg">{f.name}</h3>
            <div className="mt-2 flex items-center justify-between sm:mt-3">
              <span className="text-xs font-bold text-white/70 sm:text-sm">{rand(POD_PRICE)}</span>
              <span className="grid h-7 w-7 place-items-center rounded-full text-lg font-black text-black sm:h-9 sm:w-9 sm:text-xl transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" style={{ background: f.color }}>+</span>
            </div>
          </div>
        </button>
        <AnimatePresence>
          {qty > 0 && (
            <motion.span
              key={qty}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute right-2 top-2 grid h-7 min-w-7 place-items-center rounded-full bg-zap px-2 text-sm font-black text-black shadow-lg"
            >
              ×{qty}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
