"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT_NAME, FLAVOURS, INSTAGRAM, TIKTOK, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, podSrc } from "@/lib/data";
import { SectionHead } from "../ui/section-head";
import { CardSpotlight } from "../ui/card-spotlight";

const WHY = [
  { t: "Unbeatable value", d: "Start with a whole kit for just R150 and keep going with pods at R90 each." },
  { t: "Massive variety", d: "20+ flavours, so there's always something new to try." },
  { t: "Buy once, switch forever", d: "Keep your device and just swap the pod. Less waste, less spend." },
  { t: "Looks the part", d: "Bold colours and a clean design that stands out." },
];

/** Pods rain across a giant CTA as you scroll; then reasons, contacts and the legal bit. */
export function Finale() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".rain-pod").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: -60 - (i % 3) * 40, rotate: (i % 2 ? -1 : 1) * 30 },
          {
            yPercent: 80 + (i % 4) * 30,
            rotate: (i % 2 ? 1 : -1) * 25,
            ease: "none",
            scrollTrigger: { trigger: ".rain", start: "top bottom", end: "bottom top", scrub: 0.5 + (i % 3) * 0.3 },
          }
        );
      });
      gsap.from(".why-card", {
        y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".why", start: "top 85%" },
      });
    },
    { scope: root }
  );

  const rain = FLAVOURS.slice(0, 14);

  return (
    <section ref={root} id="contact" className="relative">
      <div className="rain relative flex min-h-[90svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_srgb,var(--accent)_30%,transparent),transparent_75%)]" />
        {rain.map((f, i) => (
          <div
            key={f.id}
            className="rain-pod pointer-events-none absolute"
            style={{ left: `${(i * 97) % 100}%`, top: `${(i * 37) % 70}%`, width: `${60 + (i % 4) * 30}px`, filter: i % 3 === 0 ? "blur(3px)" : undefined, opacity: i % 3 === 0 ? 0.5 : 0.95 }}
          >
            <Image src={podSrc(f.id)} alt="" width={300} height={640} className="h-auto w-full drop-shadow-[0_20px_20px_rgba(0,0,0,.6)]" sizes="150px" />
          </div>
        ))}
        <div className="relative z-10 px-5 text-center">
          <span className="tag"><span>And there&apos;s more</span></span>
          <h2 className="display mt-6 text-[15vw] sm:text-[11vw] lg:text-[10rem]">
            Over <span className="text-zap">20</span><br />flavours.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Beyond the core range, the line-up keeps growing, with classics like Strawberry Blast, Watermelon Ice, Blue Razz, Cola and Vanilla Custard.
          </p>
          <a href="#order" className="mt-8 inline-block rounded-full bg-white px-9 py-4 text-lg font-black uppercase italic text-black transition hover:scale-105 hover:shadow-[0_0_60px_var(--accent)]">
            Get yours now
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHead tag="Why Crushed Switch+" a="Get yours" b="now." center />
        <div className="why mt-12 grid gap-5 md:grid-cols-2">
          {WHY.map((w) => (
            <CardSpotlight key={w.t} className="why-card flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-black text-black">✓</span>
              <div>
                <h3 className="display text-2xl text-[var(--accent)]">{w.t}</h3>
                <p className="mt-1 text-white/70">{w.d}</p>
              </div>
            </CardSpotlight>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="group rounded-3xl border border-white/10 bg-panel p-7 text-center transition hover:-translate-y-1 hover:border-[#25D366]">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-[#25D366]">WhatsApp / Call {CONTACT_NAME}</div>
            <div className="mt-2 text-2xl font-black">{WHATSAPP_DISPLAY}</div>
          </a>
          <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="rounded-3xl border border-white/10 bg-panel p-7 text-center transition hover:-translate-y-1 hover:border-[#e1306c]">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-[#f56fa1]">Instagram</div>
            <div className="mt-2 text-2xl font-black">@{INSTAGRAM}</div>
          </a>
          <a href={`https://www.tiktok.com/@${TIKTOK}`} target="_blank" rel="noreferrer" className="rounded-3xl border border-white/10 bg-panel p-7 text-center transition hover:-translate-y-1 hover:border-[#25F4EE]">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-[#25F4EE]">TikTok</div>
            <div className="mt-2 text-2xl font-black">@{TIKTOK}</div>
          </a>
        </div>

        <div className="mt-10 flex flex-col items-center gap-5 rounded-3xl border-2 border-zap bg-zap/5 p-6 sm:flex-row">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-zap text-xl font-black text-zap">18+</div>
          <p className="text-sm text-white/75">
            <b className="text-white">For adults only.</b> Crushed Switch+ products are sold only to persons aged 18 and over. Vaping products may contain nicotine, which is addictive. Not for use by non-smokers, pregnant or breastfeeding women, or people with heart conditions. Keep out of reach of children.
          </p>
        </div>
      </div>

      <footer className="relative overflow-hidden border-t border-white/10 pb-32 pt-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center sm:px-8">
          <Image src="/brand/logo-white.png" alt="Crushed Switch+" width={1400} height={446} className="w-full max-w-3xl opacity-90" />
          <p className="display text-2xl text-[var(--accent)] sm:text-4xl">Bigger flavours. Bolder vibes.</p>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">© 2026 Crushed Switch+ · South Africa · Adults 18+</p>
        </div>
      </footer>
    </section>
  );
}
