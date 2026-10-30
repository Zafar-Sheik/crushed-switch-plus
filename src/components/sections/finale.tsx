"use client";

import Image from "next/image";
import { Reveal } from "../ui/reveal";
import { CONTACT_NAME, FLAVOURS, INSTAGRAM, TIKTOK, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, podSrc } from "@/lib/data";
import { SectionHead } from "../ui/section-head";
import { CardSpotlight } from "../ui/card-spotlight";

const WHY = [
  { t: "Unbeatable value", d: "Start with a whole kit for just R150 and keep going with pods at R90 each." },
  { t: "Massive variety", d: "20+ flavours, so there's always something new to try." },
  { t: "Buy once, switch forever", d: "Keep your device and just swap the pod. Less waste, less spend." },
  { t: "Looks the part", d: "Bold colours and a clean design that stands out." },
];

export function Finale() {
  const row = FLAVOURS.filter((f) => f.category === "classics").slice(1);

  return (
    <section id="contact" className="relative">
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,color-mix(in_srgb,var(--accent)_25%,transparent),transparent_75%)]" />
        <Reveal className="px-5 text-center">
          <span className="tag"><span>And there&apos;s more</span></span>
          <h2 className="display mt-6 text-6xl sm:text-8xl">
            Over <span className="text-zap">20</span> flavours.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
            Beyond the core range, the line-up keeps growing, with classics like Strawberry Blast, Watermelon Ice, Blue Razz, Cola and Vanilla Custard.
          </p>
        </Reveal>
        <div className="mx-auto mt-12 flex max-w-5xl items-end justify-center gap-1 px-5 sm:gap-3">
          {row.map((f) => (
            <div key={f.id} className="relative aspect-[300/640] w-[11%] max-w-20 transition-transform duration-300 hover:-translate-y-3" title={f.name}>
              <Image src={podSrc(f.id)} alt={f.name} fill sizes="80px" className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,.5)]" />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="#order" className="inline-block rounded-full bg-white px-9 py-4 text-lg font-black uppercase italic text-black transition hover:bg-zap">
            Get yours now
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHead tag="Why Crushed Switch+" a="Get yours" b="now." center />
        <Reveal className="mt-12 grid gap-5 md:grid-cols-2">
          {WHY.map((w) => (
            <CardSpotlight key={w.t} className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--accent)] font-black text-black">✓</span>
              <div>
                <h3 className="display text-2xl text-[var(--accent)]">{w.t}</h3>
                <p className="mt-1 text-white/70">{w.d}</p>
              </div>
            </CardSpotlight>
          ))}
        </Reveal>

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
