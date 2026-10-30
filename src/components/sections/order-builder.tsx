"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "@/lib/gsap";
import {
  CONTACT_NAME,
  DEVICES,
  FLAVOURS,
  KIT_PRICE,
  POD_PRICE,
  WHATSAPP_DISPLAY,
  deviceSrc,
  flavourById,
  podSrc,
  rand,
} from "@/lib/data";
import { lineLabel, linePrice, useOrder, type Line } from "@/lib/order";
import { confetti } from "@/lib/confetti";
import { SectionHead } from "../ui/section-head";
import { cn } from "@/lib/utils";

export function OrderBuilder() {
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);

  return (
    <section id="order" className="relative py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead tag="The stack lab" a="Build your" b="stack.">
          Kit it out, drag pods onto your slip, spin for a surprise. When it looks right, send it straight to {CONTACT_NAME} on WhatsApp.
        </SectionHead>

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.95fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <KitStation />
            <PodWall dropRef={dropRef} onDragState={setDragging} onOver={setOver} />
            <Roulette />
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Slip dropRef={dropRef} dragging={dragging} over={over} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Kit station ───────────────────────── */

function KitStation() {
  const { addKit } = useOrder();
  const [device, setDevice] = useState("black");
  const [pod, setPod] = useState("miami-mint");
  const [qty, setQty] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const dv = DEVICES.find((d) => d.id === device)!;
  const fl = flavourById(pod);

  const add = () => {
    addKit(device, pod, qty);
    const el = stage.current;
    if (!el) return;
    // "click" the pod into the device, then send both off
    const tl = gsap.timeline();
    tl.to(el.querySelector(".ks-pod"), { x: -40, rotate: -8, duration: 0.25, ease: "power2.in" })
      .to(el.querySelector(".ks-pod"), { x: 0, rotate: 0, duration: 0.5, ease: "elastic.out(1,.4)" })
      .fromTo(el.querySelector(".ks-flash"), { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 1.6, duration: 0.6 }, "<");
    import("@/lib/fly").then(({ flyToCart }) => flyToCart(deviceSrc(device), el.querySelector(".ks-device")));
    setQty(1);
  };

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel">
      <StationLabel n="A" t="Kit station" d={`Device + 1 pod · ${rand(KIT_PRICE)}`} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 p-5 pt-0 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-7 sm:pt-0">
        <div ref={stage} className="relative flex h-56 items-end justify-center gap-1 rounded-2xl bg-black/40" style={{ background: `radial-gradient(70% 60% at 50% 60%, ${fl.color}44, transparent 70%), #0004` }}>
          <div className="ks-flash pointer-events-none absolute inset-0 m-auto h-32 w-32 rounded-full opacity-0 blur-2xl" style={{ background: fl.color }} />
          <AnimatePresence mode="popLayout">
            <motion.div key={device} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="ks-device relative mb-4 h-40 w-[102px]">
              <Image src={deviceSrc(device)} alt={dv.name} fill sizes="110px" className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,.6)]" />
            </motion.div>
          </AnimatePresence>
          <span className="mb-16 font-black text-zap">+</span>
          <AnimatePresence mode="popLayout">
            <motion.div key={pod} initial={{ y: -60, opacity: 0, rotate: -20 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="ks-pod relative mb-4 h-32 w-[60px]">
              <Image src={podSrc(pod)} alt={fl.name} fill sizes="64px" className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,.6)]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Colourway · <span className="text-white">{dv.name}</span></div>
            <div className="flex gap-3">
              {DEVICES.map((d) => (
                <button key={d.id} aria-label={d.name} aria-pressed={d.id === device} onClick={() => setDevice(d.id)}
                  className={cn("h-10 w-10 rounded-full border-2 transition hover:scale-110", d.id === device ? "scale-110 border-white" : "border-white/15")}
                  style={{ background: d.color, boxShadow: d.id === device ? `0 0 20px ${d.glow}` : undefined }} />
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">Included pod · <span style={{ color: fl.color }}>{fl.name}</span></div>
            <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" data-lenis-prevent>
              {FLAVOURS.map((f) => (
                <button key={f.id} onClick={() => setPod(f.id)} aria-label={f.name} aria-pressed={f.id === pod}
                  className={cn("relative h-16 w-10 shrink-0 rounded-lg border p-1 transition", f.id === pod ? "border-white bg-white/10" : "border-transparent hover:bg-white/5")}>
                  <Image src={podSrc(f.id)} alt="" fill sizes="40px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Stepper value={qty} onChange={(v) => setQty(Math.max(1, v))} />
            <button onClick={add} className="flex-1 rounded-full bg-zap px-6 py-3.5 font-black uppercase italic text-black transition hover:scale-[1.03] hover:shadow-[0_0_40px_#ffd60a77]">
              Add kit{qty > 1 ? `s ×${qty}` : ""} · {rand(KIT_PRICE * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Pod wall (drag or tap) ───────────────────────── */

function PodWall({ dropRef, onDragState, onOver }: {
  dropRef: React.RefObject<HTMLDivElement | null>; onDragState: (b: boolean) => void; onOver: (b: boolean) => void;
}) {
  const { addPod, podQty } = useOrder();
  const dragged = useRef(false);
  const inside = (x: number, y: number) => {
    const r = dropRef.current?.getBoundingClientRect();
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  return (
    <div className="relative select-none rounded-[1.75rem] border border-white/10 bg-panel">
      <StationLabel n="B" t="Pod wall" d={`Drag onto your slip, or tap · ${rand(POD_PRICE)} each`} />
      <div className="grid grid-cols-4 gap-2 p-5 pt-0 sm:grid-cols-6 sm:p-7 sm:pt-0 xl:grid-cols-8">
        {FLAVOURS.map((f) => {
          const q = podQty(f.id);
          return (
            <motion.button
              key={f.id}
              drag
              dragSnapToOrigin
              dragElastic={0.6}
              whileDrag={{ scale: 1.25, zIndex: 50, rotate: -6 }}
              whileTap={{ scale: 0.92 }}
              onPointerDown={() => { dragged.current = false; }}
              onDragStart={() => { dragged.current = true; onDragState(true); }}
              onDrag={(_, info) => onOver(inside(info.point.x - window.scrollX, info.point.y - window.scrollY))}
              onDragEnd={(_, info) => {
                onDragState(false);
                onOver(false);
                if (inside(info.point.x - window.scrollX, info.point.y - window.scrollY)) addPod(f.id);
              }}
              onTap={() => {
                // a drag that ends over the slip already added the pod
                if (!dragged.current) addPod(f.id);
              }}
              data-cursor="Drag"
              aria-label={`Add ${f.name} pod`}
              className="group relative flex aspect-[3/4] touch-none flex-col items-center justify-end rounded-xl border border-white/5 bg-black/30 p-1.5 hover:border-white/20"
              style={{ background: q ? `${f.color}22` : undefined }}
            >
              <div className="relative h-[78%] w-full">
                <Image src={podSrc(f.id)} alt="" fill sizes="70px" draggable={false} className="pointer-events-none object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,.5)]" />
              </div>
              <span className="mt-1 line-clamp-1 w-full text-center text-[9px] font-bold uppercase leading-tight text-white/60">{f.name}</span>
              {q > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-zap px-1 text-[10px] font-black text-black">{q}</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Roulette ───────────────────────── */

const REEL = [...FLAVOURS, ...FLAVOURS, ...FLAVOURS, ...FLAVOURS];
const ROW = 64;

function Roulette() {
  const { addPod } = useOrder();
  const strip = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const pos = useRef(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const pick = Math.floor(Math.random() * FLAVOURS.length);
    const target = FLAVOURS.length * 3 + pick;
    gsap.fromTo(
      strip.current,
      { y: -(pos.current % FLAVOURS.length) * ROW },
      {
        y: -target * ROW,
        duration: 2.6,
        ease: "power4.out",
        onComplete: () => {
          pos.current = pick;
          gsap.set(strip.current, { y: -pick * ROW - FLAVOURS.length * 3 * ROW });
          setResult(pick);
          setSpinning(false);
        },
      }
    );
  };

  const f = result !== null ? FLAVOURS[result] : null;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel">
      <StationLabel n="C" t="Can't decide?" d="Spin the flavour roulette" />
      <div className="flex flex-col items-center gap-5 p-5 pt-0 sm:flex-row sm:p-7 sm:pt-0">
        <div className="relative h-[192px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 sm:w-80">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-16 -translate-y-1/2 border-y-2 border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]" />
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(#000c,transparent_35%,transparent_65%,#000c)]" />
          <div ref={strip} style={{ paddingTop: ROW }}>
            {REEL.map((fl, i) => (
              <div key={i} className="flex items-center gap-3 px-4" style={{ height: ROW }}>
                <div className="relative h-12 w-7 shrink-0"><Image src={podSrc(fl.id)} alt="" fill sizes="28px" className="object-contain" /></div>
                <span className="truncate font-black uppercase italic" style={{ color: fl.color }}>{fl.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-3">
          <AnimatePresence mode="wait">
            {f ? (
              <motion.p key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-white/70">
                Fate says <b style={{ color: f.color }}>{f.name}</b>. Trust it?
              </motion.p>
            ) : (
              <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/60">
                {spinning ? "Shuffling the pods…" : "Let the reel pick your next pod."}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex gap-3">
            <button onClick={spin} disabled={spinning} className="flex-1 rounded-full border-2 border-[var(--accent)] px-5 py-3 font-black uppercase italic text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-black disabled:opacity-50">
              {spinning ? "Spinning…" : result === null ? "Spin" : "Spin again"}
            </button>
            {f && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => { addPod(f.id); setResult(null); }} className="flex-1 rounded-full px-5 py-3 font-black uppercase italic text-black" style={{ background: f.color }}>
                Add it · R90
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── The slip ───────────────────────── */

function Slip({ dropRef, dragging, over }: { dropRef: React.RefObject<HTMLDivElement | null>; dragging: boolean; over: boolean }) {
  const { lines, total, count, setQty, customer, setCustomer, whatsappUrl, buildMessage, clear } = useOrder();
  const [view, setView] = useState<"slip" | "chat">("slip");
  const [nameError, setNameError] = useState(false);
  const [sent, setSent] = useState(false);
  const shownTotal = useCountUp(total);
  const btn = useRef<HTMLButtonElement>(null);
  const [orderNo, setOrderNo] = useState("0000");
  // Client-only random order number, so server and client markup match.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOrderNo(String(Math.floor(1000 + Math.random() * 9000))), []);

  const send = () => {
    if (!lines.length) return;
    if (!customer.name.trim()) {
      setNameError(true);
      document.getElementById("cs-name")?.focus();
      return;
    }
    window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
    const r = btn.current?.getBoundingClientRect();
    if (r) confetti(r.left + r.width / 2, r.top, [...new Set(lines.map((l) => flavourById(l.flavour).color))].concat("#ffd60a", "#b45cff"));
    setSent(true);
  };

  return (
    <div
      ref={dropRef}
      className={cn(
        "relative rounded-[1.75rem] border-2 border-dashed p-3 transition-all duration-300",
        dragging ? "border-[var(--accent)]" : "border-transparent",
        over && "scale-[1.02] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
      )}
    >
      <AnimatePresence>
        {dragging && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-30 grid place-items-center rounded-[1.6rem] bg-black/60 backdrop-blur-sm">
            <span className="display text-4xl text-[var(--accent)]">{over ? "Let go!" : "Drop pod here"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* printer head */}
      <div className="relative z-10 flex items-center justify-between rounded-2xl bg-gradient-to-b from-[#2a1d3b] to-[#160d22] px-4 py-3 shadow-[0_10px_30px_-10px_#000]">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", count ? "animate-pulse bg-[#25D366] shadow-[0_0_10px_#25D366]" : "bg-white/20")} />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/60">{count ? `${count} item${count > 1 ? "s" : ""} on slip` : "Waiting for pods"}</span>
        </div>
        <div className="flex rounded-full bg-black/40 p-0.5 text-[11px] font-bold uppercase">
          {(["slip", "chat"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("relative rounded-full px-3 py-1", view === v ? "text-black" : "text-white/60")}>
              {view === v && <motion.span layoutId="slip-tab" className="absolute inset-0 rounded-full bg-white" />}
              <span className="relative">{v === "slip" ? "Slip" : "Preview"}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="relative z-0 mx-3 -mt-1 h-2 rounded-b bg-black shadow-inner" />

      <AnimatePresence mode="wait" initial={false}>
        {view === "slip" ? (
          <motion.div key="slip" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="relative mx-5 -mt-1">
            <div className="relative bg-[#f7f4ee] px-5 pb-8 pt-6 font-mono text-[13px] text-[#1b1424] shadow-[0_30px_60px_-20px_#000]">
              <div aria-hidden className="absolute inset-x-0 -bottom-[9px] h-[10px] bg-[radial-gradient(circle_at_8px_0,#f7f4ee_7px,transparent_7.5px)] bg-[length:16px_10px] bg-repeat-x" />
              <div className="text-center">
                <div className="text-lg font-black italic tracking-tight">CRUSHED SWITCH+</div>
                <div className="text-[10px] uppercase tracking-[0.3em] opacity-60">Bigger flavours · Bolder vibes</div>
                <div className="mt-2 text-[10px] opacity-60">ORDER #{orderNo} · {WHATSAPP_DISPLAY}</div>
              </div>
              <Dash />
              {lines.length === 0 ? (
                <div className="py-8 text-center opacity-50">
                  <div className="text-3xl">∅</div>
                  <p className="mt-2">Your slip is empty.<br />Add a kit or drop some pods in.</p>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <SlipLine key={l.key} l={l} setQty={setQty} />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
              <Dash />
              <div className="flex justify-between text-[11px] uppercase opacity-70"><span>Kits</span><span>{lines.filter((l) => l.kind === "kit").reduce((s, l) => s + l.qty, 0)}</span></div>
              <div className="flex justify-between text-[11px] uppercase opacity-70"><span>Extra pods</span><span>{lines.filter((l) => l.kind === "pod").reduce((s, l) => s + l.qty, 0)}</span></div>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-base font-black">TOTAL</span>
                <span className="text-3xl font-black italic">{rand(shownTotal)}</span>
              </div>
              <Dash />
              <Barcode seed={orderNo + count} />
              {lines.length > 0 && (
                <button onClick={clear} className="mx-auto mt-3 block text-[10px] uppercase tracking-widest underline opacity-50 hover:opacity-100">Clear slip</button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="chat" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="mx-3 mt-2 overflow-hidden rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 bg-[#1f2c33] px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-grape font-black text-black">{CONTACT_NAME[0]}</div>
              <div>
                <div className="text-sm font-bold">{CONTACT_NAME} · Crushed Switch+</div>
                <div className="text-[11px] text-white/50">{WHATSAPP_DISPLAY}</div>
              </div>
            </div>
            <div className="max-h-[420px] min-h-[260px] overflow-y-auto bg-[#0b141a] bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:14px_14px] p-4" data-lenis-prevent>
              <div className="ml-auto w-fit max-w-[92%] whitespace-pre-wrap rounded-xl rounded-tr-none bg-[#005c4b] px-3 py-2 text-[13px] leading-relaxed text-white shadow">
                <WaText text={lines.length ? buildMessage() : "Add something to your stack to preview the message."} />
                <div className="mt-1 text-right text-[10px] text-white/50">now ✓✓</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* details */}
      <div className="mt-5 space-y-3 px-2">
        <div>
          <input
            id="cs-name"
            value={customer.name}
            onChange={(e) => { setCustomer({ name: e.target.value }); setNameError(false); }}
            placeholder="Your name *"
            autoComplete="name"
            className={cn("w-full rounded-xl border bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/35 focus:bg-white/10", nameError ? "border-red-400" : "border-white/10 focus:border-[var(--accent)]")}
          />
          {nameError && <p className="mt-1 text-xs text-red-300">Pop your name in so {CONTACT_NAME} knows who&apos;s ordering.</p>}
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
          {(["delivery", "collect"] as const).map((d) => (
            <button key={d} onClick={() => setCustomer({ delivery: d })} className={cn("rounded-lg py-2.5 text-sm font-bold uppercase transition-colors", customer.delivery === d ? "bg-[var(--accent)] text-black" : "text-white/60")}>
              <span>{d === "delivery" ? "🚚 Delivery" : "📍 Collect"}</span>
            </button>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {customer.delivery === "delivery" && (
            <motion.input
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              value={customer.area}
              onChange={(e) => setCustomer({ area: e.target.value })}
              placeholder="Delivery area / suburb"
              autoComplete="address-level2"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/35 focus:border-[var(--accent)] focus:bg-white/10"
            />
          )}
        </AnimatePresence>
        <textarea
          value={customer.notes}
          onChange={(e) => setCustomer({ notes: e.target.value })}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/35 focus:border-[var(--accent)] focus:bg-white/10"
        />

        <button
          ref={btn}
          onClick={send}
          disabled={!lines.length}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#25D366] px-6 py-5 text-lg font-black uppercase italic text-black transition enabled:hover:scale-[1.02] enabled:hover:shadow-[0_0_50px_#25D36688] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 group-enabled:group-hover:translate-x-full" />
          <WaIcon />
          <span className="relative">Order on WhatsApp · {rand(total)}</span>
        </button>
        <p className="text-center text-xs text-white/40">Opens WhatsApp with your order ready to send to {CONTACT_NAME} ({WHATSAPP_DISPLAY}). Adults 18+ only.</p>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 grid place-items-center rounded-[1.6rem] bg-black/85 p-6 text-center backdrop-blur">
            <div>
              <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#25D366] text-4xl text-black">✓</motion.div>
              <h3 className="display mt-5 text-4xl">Order ready!</h3>
              <p className="mt-2 text-white/70">WhatsApp opened with your order. Just hit send and {CONTACT_NAME} will confirm.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-5 py-3 font-bold text-black">Didn&apos;t open? Tap here</a>
                <button onClick={() => setSent(false)} className="rounded-full border border-white/20 px-5 py-3 font-bold">Back to slip</button>
                <button onClick={() => { clear(); setSent(false); }} className="rounded-full border border-white/20 px-5 py-3 font-bold">Start fresh</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SlipLine({ l, setQty }: { l: Line; setQty: (k: string, q: number) => void }) {
  const f = flavourById(l.flavour);
  return (
    <motion.li
      layout
      initial={{ height: 0, opacity: 0, y: -10 }}
      animate={{ height: "auto", opacity: 1, y: 0 }}
      exit={{ height: 0, opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 py-2">
        <div className="relative flex h-11 w-9 shrink-0 items-end justify-center">
          {l.kind === "kit" && <Image src={deviceSrc(l.device)} alt="" width={30} height={46} className="absolute -left-2 bottom-0 h-10 w-auto" />}
          <Image src={podSrc(l.flavour)} alt="" width={22} height={46} className="relative h-10 w-auto" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-bold uppercase">{lineLabel(l).split(" · ")[0]}</div>
          <div className="truncate text-[11px] opacity-70">
            <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ background: f.color }} />
            {lineLabel(l).split(" · ")[1]}
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-black/15">
          <button aria-label="Less" onClick={() => setQty(l.key, l.qty - 1)} className="h-6 w-6 rounded-full hover:bg-black/10">−</button>
          <span className="w-4 text-center font-bold">{l.qty}</span>
          <button aria-label="More" onClick={() => setQty(l.key, l.qty + 1)} className="h-6 w-6 rounded-full hover:bg-black/10">+</button>
        </div>
        <div className="w-14 text-right font-bold">{rand(linePrice(l))}</div>
      </div>
    </motion.li>
  );
}

/* ───────────────────────── bits ───────────────────────── */

function StationLabel({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="flex items-center gap-4 p-5 sm:p-7">
      <span className="display grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent)] text-xl text-black transition-colors duration-700">{n}</span>
      <div>
        <h3 className="display text-2xl">{t}</h3>
        <p className="text-sm text-white/55">{d}</p>
      </div>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center rounded-full border border-white/15">
      <button aria-label="Fewer" onClick={() => onChange(value - 1)} className="h-12 w-11 text-xl hover:text-[var(--accent)]">−</button>
      <span className="w-6 text-center font-black">{value}</span>
      <button aria-label="More" onClick={() => onChange(value + 1)} className="h-12 w-11 text-xl hover:text-[var(--accent)]">+</button>
    </div>
  );
}

function Dash() {
  return <div className="my-3 border-t-2 border-dashed border-black/20" />;
}

function Barcode({ seed }: { seed: string }) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const bars = Array.from({ length: 48 }, (_, i) => ((h >> (i % 24)) & 3) + 1);
  return (
    <div className="flex h-10 items-stretch justify-center gap-[2px]">
      {bars.map((w, i) => <span key={i} className="bg-[#1b1424]" style={{ width: w }} />)}
    </div>
  );
}

/** Render WhatsApp *bold* markers the way WhatsApp would. */
function WaText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*\n]+\*)/g).map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? <b key={i}>{p.slice(1, -1)}</b> : <span key={i}>{p}</span>
      )}
    </>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7a11.8 11.8 0 0 0 5.7 1.4A11.8 11.8 0 0 0 20.4 3.6z" />
    </svg>
  );
}

function useCountUp(value: number) {
  const [v, setV] = useState(value);
  const o = useRef({ v: value });
  useEffect(() => {
    const t = gsap.to(o.current, { v: value, duration: 0.7, ease: "power3.out", onUpdate: () => setV(Math.round(o.current.v)) });
    return () => { t.kill(); };
  }, [value]);
  return v;
}
