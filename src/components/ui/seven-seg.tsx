"use client";

import { cn } from "@/lib/utils";

// Segments: a b c d e f g
const MAP: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd",
  "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", " ": "",
  R: "eg", E: "afged", A: "abcefg", d: "bcdeg", Y: "fgbcd", C: "afed", H: "fbgec", P: "abfge",
};

const SEGS: Record<string, string> = {
  a: "M14 6 L46 6 L40 12 L20 12 Z",
  b: "M48 8 L48 44 L42 40 L42 14 Z",
  c: "M48 52 L48 88 L42 82 L42 56 Z",
  d: "M14 90 L46 90 L40 84 L20 84 Z",
  e: "M12 52 L12 88 L18 82 L18 56 Z",
  f: "M12 8 L12 44 L18 40 L18 14 Z",
  g: "M16 48 L20 44 L40 44 L44 48 L40 52 L20 52 Z",
};

export function SevenSegDigit({ char, on = "currentColor", off = "rgba(255,255,255,0.06)", className }: {
  char: string; on?: string; off?: string; className?: string;
}) {
  const lit = MAP[char] ?? "";
  return (
    <svg viewBox="0 0 60 96" className={cn("h-full w-auto -skew-x-6", className)} aria-hidden>
      {Object.entries(SEGS).map(([k, d]) => (
        <path
          key={k}
          d={d}
          fill={lit.includes(k) ? on : off}
          style={{
            transition: "fill .15s",
            filter: lit.includes(k) ? `drop-shadow(0 0 6px ${on === "currentColor" ? "var(--accent)" : on})` : undefined,
          }}
        />
      ))}
    </svg>
  );
}

export function SevenSeg({ value, className, color, pad = 0 }: { value: string | number; className?: string; color?: string; pad?: number }) {
  const str = String(value).padStart(pad, " ");
  return (
    <span className={cn("inline-flex h-12 items-center gap-[0.08em]", className)} role="img" aria-label={String(value)}>
      {str.split("").map((c, i) => (
        <SevenSegDigit key={i} char={c} on={color} />
      ))}
    </span>
  );
}
