import { FLAVOURS } from "@/lib/data";

/** A steady, slow ribbon of flavour names. Pauses on hover. */
export function FlavourMarquee() {
  const names = [...FLAVOURS, ...FLAVOURS];
  return (
    <div className="group overflow-hidden border-y border-white/10 bg-[var(--accent)] py-3 transition-colors duration-700" aria-hidden>
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap group-hover:[animation-play-state:paused]" style={{ ["--duration" as string]: "60s" }}>
        {names.map((f, i) => (
          <span key={i} className="display flex items-center gap-8 text-2xl text-black sm:text-3xl">
            {f.name}
            <span className="text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
