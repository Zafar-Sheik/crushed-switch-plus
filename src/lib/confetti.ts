import { gsap } from "./gsap";

/** Burst of flavour-coloured pod confetti from a point on screen. */
export function confetti(x: number, y: number, colors: string[]) {
  const n = 90;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("i");
    const w = 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${w * (1 + Math.random())}px`,
      borderRadius: Math.random() > 0.5 ? "3px" : "50%",
      background: colors[i % colors.length],
      zIndex: "10001",
      pointerEvents: "none",
    });
    document.body.appendChild(el);
    gsap.to(el, {
      duration: 2.2 + Math.random(),
      physics2D: { velocity: 500 + Math.random() * 700, angle: -90 + (Math.random() - 0.5) * 110, gravity: 900 },
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      ease: "power1.in",
      onComplete: () => el.remove(),
    });
  }
}
