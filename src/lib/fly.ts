import gsap from "gsap";

/** Clone a product image and arc it into the cart button in the dock. */
export function flyToCart(src: string, from: HTMLElement | null) {
  const target = document.getElementById("cart-target");
  if (!from || !target || typeof window === "undefined") return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  const size = Math.min(a.height, 220);
  Object.assign(img.style, {
    position: "fixed",
    left: `${a.left + a.width / 2 - size / 4}px`,
    top: `${a.top + a.height / 2 - size / 2}px`,
    height: `${size}px`,
    zIndex: "9999",
    pointerEvents: "none",
    filter: "drop-shadow(0 20px 30px rgba(0,0,0,.5))",
  });
  document.body.appendChild(img);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const tl = gsap.timeline({
    onComplete: () => {
      img.remove();
      gsap.fromTo(target, { scale: 1.45 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,0.35)" });
    },
  });
  tl.to(img, { x: dx * 0.5, y: Math.min(dy, 0) - 160, rotate: -25, scale: 0.7, duration: 0.45, ease: "power2.out" })
    .to(img, { x: dx, y: dy, rotate: 20, scale: 0.12, opacity: 0.6, duration: 0.5, ease: "power3.in" });
}
