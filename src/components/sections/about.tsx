"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { CardContainer, CardItem } from "../ui/card-3d";
import { CardSpotlight } from "../ui/card-spotlight";

const PILLARS = [
  { t: "Great flavours", d: "20+ flavours, from fruit to ice to energy", icon: <path d="M7 18a5 5 0 0 1-.5-10A6 6 0 0 1 18 8.5 4.5 4.5 0 0 1 17.5 18z" /> },
  { t: "Long lasting", d: "A device you keep and simply re-pod", icon: <><rect x="7" y="4" width="10" height="17" rx="2" /><path d="M10 2h4M12.5 8 10 13h4l-2.5 5" /></> },
  { t: "Compact & portable", d: "Pocket-sized and easy to take anywhere", icon: <><rect x="6" y="7" width="12" height="14" rx="3" /><path d="M10 7V4h4v3M12 12v4" /></> },
  { t: "Quality you can trust", d: "Consistent build and flavour in every pod", icon: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6zM9 12l2 2 4-4" /> },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".about-copy", { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".about-copy", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      gsap.from(".pillar", {
        y: 60, opacity: 0, rotateX: -30, duration: 0.9, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".pillars", start: "top 85%" },
      });
      gsap.from(".mv-card", {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".mv", start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-grape/20 blur-[120px]" />
      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <span className="tag"><span>Who we are</span></span>
          <h2 className="display mt-5 text-6xl sm:text-8xl">
            Bigger<br />flavours.<br />
            <span className="text-[var(--accent)] transition-colors duration-700">Bolder vibes.</span>
          </h2>
          <p className="about-copy mt-8 max-w-xl text-xl leading-relaxed text-white sm:text-2xl">
            Crushed Switch+ is a refillable pod vape system for adults who want proper flavour without the hassle. You buy the device once, then click in a new pod whenever you want a new flavour. It&apos;s simple, it&apos;s affordable, and it looks good in your pocket.
          </p>
        </div>

        <CardContainer intensity={18}>
          <div className="relative [transform-style:preserve-3d]">
            <CardItem z={20}>
              <div className="relative overflow-hidden rounded-[2rem] border-2 border-grape shadow-[0_0_80px_-10px_#b45cff]">
                <Image src="/brand/poster.jpg" alt="Crushed Switch+ poster: each pod R90, whole kit R150, over 20 flavours" width={1071} height={1600} className="h-auto w-full max-w-md" sizes="(min-width:1024px) 448px, 90vw" />
              </div>
            </CardItem>
            <CardItem z={90} rotateZ={-8} className="absolute -left-6 -top-6 sm:-left-10">
              <div className="rounded-2xl bg-zap px-4 py-3 text-center font-black italic text-black shadow-xl">
                <div className="text-xs uppercase tracking-widest">Each pod</div>
                <div className="text-3xl leading-none">R90</div>
              </div>
            </CardItem>
            <CardItem z={120} rotateZ={8} className="absolute -bottom-6 -right-4 sm:-right-8">
              <div className="rounded-2xl bg-white px-4 py-3 text-center font-black italic text-black shadow-xl">
                <div className="text-xs uppercase tracking-widest">Whole kit</div>
                <div className="text-3xl leading-none">R150</div>
              </div>
            </CardItem>
          </div>
        </CardContainer>
      </div>

      <div className="mv mt-24 grid gap-5 md:grid-cols-2">
        <CardSpotlight className="mv-card">
          <h3 className="display text-3xl text-[var(--accent)]">Our mission</h3>
          <p className="mt-3 text-lg text-white/75">Give adult vapers big, bold flavour at a fair price, with a device they buy once and enjoy pod after pod.</p>
        </CardSpotlight>
        <CardSpotlight className="mv-card">
          <h3 className="display text-3xl text-[var(--accent)]">Our vision</h3>
          <p className="mt-3 text-lg text-white/75">To be South Africa&apos;s go-to name in pod vaping, known for a flavour range nobody else can match and a brand people want to be seen with.</p>
        </CardSpotlight>
      </div>

      <div className="pillars mt-5 grid grid-cols-2 gap-5 [perspective:900px] lg:grid-cols-4">
        {PILLARS.map((p) => (
          <CardSpotlight key={p.t} className="pillar p-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-[var(--accent)] text-[var(--accent)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--accent)] group-hover:text-black">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">{p.icon}</svg>
            </div>
            <h4 className="mt-4 font-black uppercase tracking-wide">{p.t}</h4>
            <p className="mt-1 text-sm text-white/60">{p.d}</p>
          </CardSpotlight>
        ))}
      </div>
    </section>
  );
}
