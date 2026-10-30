"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { flavourById, podSrc } from "@/lib/data";
import { SevenSeg } from "../ui/seven-seg";
import { cn } from "@/lib/utils";

const DECK = ["miami-mint", "mexican-mango", "cherry-slush", "strawberry-blueberry", "sour-apple", "grape-ice", "peach-ice", "blue-razz"];

const STEPS = [
  { n: "01", t: "Get the kit", d: "Start with the whole kit for R150: the device plus your first pod." },
  { n: "02", t: "Pick a flavour", d: "Choose from 20+ flavours. Go fruity, icy, minty or energy." },
  { n: "03", t: "Switch it up", d: "When a pod runs out, or you want a change, click in a new one for R90." },
];

export function SwitchSystem() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [pod, setPod] = useState(0);

  useGSAP(
    () => {
      const pods = gsap.utils.toArray<HTMLElement>(".deck-pod");
      gsap.set(pods.slice(1), { yPercent: 130, opacity: 0, rotate: -18 });
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            setStep(Math.min(2, Math.floor(self.progress * 3)));
            setPod(Math.min(DECK.length - 1, Math.round(self.progress * (DECK.length - 1))));
          },
        },
      });
      tl.from(".sw-device", { xPercent: -40, opacity: 0, rotate: -10, duration: 0.6 })
        .from(".sw-plus", { scale: 0, rotate: -180, duration: 0.4 }, "<0.2");
      for (let i = 1; i < pods.length; i++) {
        tl.to(pods[i - 1], { yPercent: -120, xPercent: 40, rotate: 22, opacity: 0, duration: 1 })
          .to(pods[i], { yPercent: 0, opacity: 1, rotate: 0, duration: 1 }, "<0.15")
          .fromTo(".sw-flash", { opacity: 0.0 }, { opacity: 0.6, duration: 0.15, yoyo: true, repeat: 1 }, "<0.7");
      }
      tl.to(".sw-progress", { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
    },
    { scope: root }
  );

  const f = flavourById(DECK[pod]);

  return (
    <section ref={root} id="switch" className="relative flex h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 transition-[background] duration-500" style={{ background: `radial-gradient(50% 60% at 72% 55%, ${f.color}40, transparent 70%), #07040c` }} />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="tag"><span>The Switch+ system</span></span>
          <h2 className="display mt-4 text-4xl sm:text-7xl">
            Swap flavours<br />
            <span style={{ color: f.color }} className="transition-colors duration-500">in seconds.</span>
          </h2>
          <p className="mt-4 hidden max-w-lg text-lg text-white/70 sm:block">
            The name says it all. One rechargeable device with a digital display, and a click-in pod you can change whenever you want to try a different flavour.
          </p>
          <ol className="mt-6 grid grid-cols-3 gap-2 lg:mt-10 lg:grid-cols-1 lg:gap-3">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className={cn(
                  "rounded-2xl border p-3 transition-all duration-500 lg:flex lg:items-start lg:gap-5 lg:p-5",
                  i === step ? "border-white/30 bg-white/[0.06] lg:translate-x-3" : "border-white/5 opacity-40"
                )}
              >
                <span className="display text-outline text-3xl lg:text-5xl" style={{ color: i === step ? f.color : "#fff" }}>{s.n}</span>
                <div>
                  <h3 className="mt-1 text-sm font-black uppercase italic lg:text-xl">{s.t}</h3>
                  <p className="mt-1 hidden text-white/60 lg:block">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="sw-progress h-full origin-left scale-x-0 bg-[var(--accent)]" />
          </div>
        </div>

        <div className="relative flex h-[44svh] items-center justify-center gap-3 sm:gap-8 lg:h-[70svh]">
          <div className="sw-flash pointer-events-none absolute inset-0 rounded-full opacity-0 blur-3xl" style={{ background: f.color }} />
          <div className="sw-device relative h-full max-h-[460px]">
            <Image src="/products/device-black.webp" alt="Crushed Switch+ device in Midnight Black" width={409} height={640} className="h-full w-auto object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.7)]" />
            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/10 bg-black/80 px-3 py-2 backdrop-blur" style={{ color: f.color }}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Pod</span>
              <SevenSeg value={String(pod + 1).padStart(2, "0")} className="h-7" />
            </div>
          </div>
          <div className="sw-plus display text-6xl text-zap sm:text-8xl">+</div>
          <div className="relative h-[80%] max-h-[400px] aspect-[300/640]">
            {DECK.map((id) => (
              <Image key={id} src={podSrc(id)} alt={flavourById(id).name} width={300} height={640} className="deck-pod absolute inset-0 h-full w-full object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,.6)]" />
            ))}
            <div className="absolute -bottom-10 left-1/2 w-max -translate-x-1/2 text-center font-black uppercase italic" style={{ color: f.color }}>
              {f.name}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
