"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, Draggable, SplitText, useGSAP } from "@/lib/gsap";
import { CATEGORIES, FLAVOURS, POD_PRICE, WHATSAPP_NUMBER, podSrc, rand } from "@/lib/data";
import { useOrder } from "@/lib/order";
import { flyToCart } from "@/lib/fly";
import { Spotlight } from "../ui/spotlight";

const N = FLAVOURS.length;
const STEP = 360 / N;
const PX_PER_DEG = 4;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const proxy = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const rot = useRef({ v: 0 });
  const drag = useRef<Draggable | null>(null);
  const idle = useRef(0);
  const [index, setIndex] = useState(0);
  const [radius, setRadius] = useState(520);
  const radiusRef = useRef(520);
  const { addPod, setAccent } = useOrder();
  const flavour = FLAVOURS[index];

  useEffect(() => setAccent(flavour.color), [flavour.color, setAccent]);

  // Paint the ring from the current rotation: transform + depth-based fade/scale.
  const paint = () => {
    const r = rot.current.v;
    if (ring.current) ring.current.style.transform = `translateZ(${-radiusRef.current}px) rotateY(${r}deg)`;
    items.current.forEach((el, i) => {
      if (!el) return;
      const a = (((i * STEP + r) % 360) + 540) % 360 - 180; // -180..180, 0 = front
      const front = Math.cos((a * Math.PI) / 180); // 1 front, -1 back
      const t = Math.max(0, front);
      el.style.opacity = String(0.12 + 0.88 * Math.pow((front + 1) / 2, 2.2));
      el.style.filter = `brightness(${0.45 + t * 0.55})`;
      const img = el.firstElementChild as HTMLElement | null;
      if (img) img.style.transform = `scale(${0.75 + Math.pow(t, 6) * 0.55})`;
      el.style.zIndex = String(Math.round(t * 100));
    });
    const idx = ((Math.round(-r / STEP) % N) + N) % N;
    setIndex((p) => (p === idx ? p : idx));
  };

  const goTo = (target: number) => {
    const cur = rot.current.v;
    const base = -target * STEP;
    // choose the equivalent angle closest to current
    const k = Math.round((cur - base) / 360);
    const dest = base + k * 360;
    gsap.to(rot.current, {
      v: dest,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => {
        paint();
        gsap.set(proxy.current, { x: rot.current.v * PX_PER_DEG });
        drag.current?.update();
      },
    });
  };

  // Radius follows viewport so the ring never overflows on phones.
  useEffect(() => {
    const fit = () => {
      const r = Math.max(300, Math.min(620, window.innerWidth * 0.42));
      radiusRef.current = r;
      setRadius(r);
      paint();
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useGSAP(
    () => {
      paint();
      drag.current = Draggable.create(proxy.current, {
        type: "x",
        trigger: ring.current?.parentElement,
        inertia: true,
        onPress: () => { idle.current = Date.now(); gsap.killTweensOf(rot.current); },
        onDrag() { rot.current.v = this.x / PX_PER_DEG; paint(); },
        onThrowUpdate() { rot.current.v = this.x / PX_PER_DEG; paint(); },
        snap: (x: number) => Math.round(x / (STEP * PX_PER_DEG)) * STEP * PX_PER_DEG,
      })[0];

      const intro = () => {
        const split = SplitText.create(".hero-line", { type: "chars", mask: "lines" });
        const tl = gsap.timeline();
        tl.from(split.chars, { yPercent: 120, rotate: 8, duration: 0.9, ease: "expo.out", stagger: 0.018 })
          .from(".hero-fade", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0.35)
          .fromTo(rot.current, { v: 220 }, { v: 0, duration: 2, ease: "expo.out", onUpdate: paint }, 0);
      };
      window.addEventListener("cs:ready", intro, { once: true });

      // parallax out on scroll
      gsap.to(".hero-stage", {
        yPercent: 18,
        scale: 0.92,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => window.removeEventListener("cs:ready", intro);
    },
    { scope: root }
  );

  // Gentle autoplay while nobody is touching it.
  useEffect(() => {
    idle.current = Date.now();
    const id = setInterval(() => {
      if (Date.now() - idle.current < 6000 || drag.current?.isPressed || drag.current?.isThrowing) return;
      const visible = root.current && root.current.getBoundingClientRect().bottom > 0;
      if (visible) goTo((index + 1) % N);
    }, 3200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Scramble the flavour name on change.
  useEffect(() => {
    if (!nameRef.current) return;
    gsap.to(nameRef.current, { duration: 0.6, scrambleText: { text: flavour.name, chars: "CRUSHED+SWITCH", speed: 0.6 } });
  }, [flavour.name]);

  const nudge = (d: number) => { idle.current = Date.now(); goTo((index + d + N) % N); };
  const cat = CATEGORIES.find((c) => c.id === flavour.category)!;

  return (
    <section ref={root} id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-28">
      {/* flavour-tinted atmosphere */}
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background: `radial-gradient(60% 50% at 50% 70%, ${flavour.color}55, transparent 70%), radial-gradient(40% 40% at 15% 10%, #6a1fb855, transparent 70%), #07040c`,
        }}
      />
      <Spotlight className="-left-10 -top-40 md:-left-32 md:-top-20" fill={flavour.color} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <header className="hero-fade relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5 sm:px-8">
        <Image src="/brand/logo-white.png" alt="Crushed Switch+" width={1400} height={446} priority className="h-auto w-36 sm:w-44" />
        <div className="hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60 md:flex">
          <span>South Africa</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span>Adults 18+</span>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur transition hover:bg-white hover:text-black"
        >
          Chat to us
        </a>
      </header>

      <div className="hero-stage relative flex flex-1 flex-col">
        <div className="relative z-0 mx-auto mt-6 w-full max-w-7xl px-5 text-center sm:px-8">
          <h1 className="display whitespace-nowrap text-[11.5vw] sm:text-[8.5vw] lg:text-[min(7.4rem,12vh)]">
            <span className="hero-line block">One device.</span>
            <span className="hero-line block text-zap">20+ flavours.</span>
            <span className="hero-line block text-outline text-white/90">Zero boring.</span>
          </h1>
        </div>

        {/* the ring */}
        <div className="relative z-10 -mt-[14vw] h-[330px] w-full select-none sm:-mt-[9vw] sm:h-[380px] lg:-mt-[min(8rem,13vh)]" data-cursor="Drag">
          <div className="absolute inset-0" style={{ perspective: "1400px", perspectiveOrigin: "50% 30%" }}>
            <div ref={ring} className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]">
              {FLAVOURS.map((f, i) => (
                <button
                  key={f.id}
                  ref={(el) => { items.current[i] = el; }}
                  onClick={() => { idle.current = Date.now(); goTo(i); }}
                  aria-label={f.name}
                  className="absolute -left-[50px] -top-[110px] h-[220px] w-[100px] sm:-left-[60px] sm:-top-[130px] sm:h-[260px] sm:w-[120px]"
                  style={{ transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)` }}
                >
                  <Image src={podSrc(f.id)} alt="" width={300} height={640} draggable={false} className="pointer-events-none h-full w-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,.6)] transition-transform duration-300" sizes="120px" />
                </button>
              ))}
            </div>
          </div>
          <div ref={proxy} className="hidden" />
          {/* floor reflection */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto h-16 w-2/3 rounded-[100%] blur-2xl" style={{ background: `${flavour.color}55` }} />
        </div>

        {/* selected flavour panel */}
        <div className="hero-fade relative z-20 mx-auto -mt-8 flex w-full max-w-3xl flex-col items-center gap-4 px-5 text-center">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
            <span className="rounded-full border border-white/15 px-3 py-1" style={{ color: flavour.color }}>{cat.name}</span>
            <span>{String(index + 1).padStart(2, "0")} / {N}</span>
          </div>
          <h2 ref={nameRef} className="display min-h-[1em] text-4xl sm:text-5xl" style={{ color: flavour.color, textShadow: `0 0 40px ${flavour.color}88` }}>
            {flavour.name}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => nudge(-1)} aria-label="Previous flavour" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-xl transition hover:bg-white hover:text-black">←</button>
            <button
              onClick={(e) => { addPod(flavour.id); flyToCart(podSrc(flavour.id), items.current[index] ?? e.currentTarget); }}
              className="group relative overflow-hidden rounded-full px-7 py-3.5 font-black uppercase italic text-black transition hover:scale-105"
              style={{ background: flavour.color, boxShadow: `0 0 40px ${flavour.color}88` }}
            >
              <span className="relative z-10">Add pod · {rand(POD_PRICE)}</span>
              <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-500 group-hover:translate-x-full" />
            </button>
            <button onClick={() => nudge(1)} aria-label="Next flavour" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-xl transition hover:bg-white hover:text-black">→</button>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">Drag the ring · tap a pod · the whole site takes its colour</p>
        </div>
      </div>
    </section>
  );
}
