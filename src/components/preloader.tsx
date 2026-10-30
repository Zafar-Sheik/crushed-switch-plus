"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

/**
 * 18+ gate. Returning adults (remembered per browser) see only a brief fade;
 * first-time visitors get the question straight away, no waiting.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"boot" | "gate" | "denied" | "done">("boot");

  const exit = () => {
    try { localStorage.setItem("cs-18", "yes"); } catch {}
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        setStage("done");
        document.documentElement.style.overflow = "";
        window.dispatchEvent(new Event("cs:ready"));
      },
    });
  };

  useEffect(() => {
    let verified = false;
    try { verified = localStorage.getItem("cs-18") === "yes"; } catch {}
    document.documentElement.style.overflow = "hidden";
    const id = setTimeout(() => (verified ? exit() : setStage("gate")), verified ? 250 : 150);
    return () => clearTimeout(id);
  }, []);

  if (stage === "done") return null;

  return (
    <div ref={root} className="fixed inset-0 z-[9000] bg-[#0b0614]">
      <div className="pl-inner absolute inset-0 grid place-items-center p-6">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <Image src="/brand/logo-white.png" alt="Crushed Switch+" width={1400} height={446} priority className="w-64 sm:w-80" />

          {stage === "gate" && (
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-zap text-3xl font-black text-zap shadow-[0_0_60px_#ffd60a55]">
                18+
              </div>
              <div>
                <h2 className="display text-4xl">Adults only.</h2>
                <p className="mt-3 text-sm text-white/60">
                  Crushed Switch+ products are sold only to persons aged 18 and over. Vaping products may contain nicotine, which is addictive.
                </p>
              </div>
              <div className="flex w-full gap-3">
                <button onClick={exit} className="flex-1 rounded-full bg-grape px-6 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:shadow-[0_0_40px_#b45cff]">
                  I&apos;m 18 or older
                </button>
                <button onClick={() => setStage("denied")} className="flex-1 rounded-full border border-white/20 px-6 py-4 font-bold uppercase italic text-white/70 transition hover:bg-white/5">
                  I&apos;m under 18
                </button>
              </div>
            </div>
          )}

          {stage === "denied" && (
            <div className="mt-10">
              <h2 className="display text-4xl text-zap">Sorry, not yet.</h2>
              <p className="mt-3 text-white/60">This site is for adults 18 and over. Come back when you&apos;re of age.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
