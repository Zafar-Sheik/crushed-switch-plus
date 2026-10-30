"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue, AnimatePresence } from "motion/react";
import { useOrder } from "@/lib/order";

type Item = { title: string; href: string; icon: React.ReactNode; id?: string };

const I = {
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />,
  switch: <path d="M7 4v16M7 20l-3-3M7 20l3-3M17 20V4M17 4l-3 3M17 4l3 3" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  tag: <path d="M3 12V4h8l10 10-8 8L3 12zM7.5 7.5h.01" />,
  palette: <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5S13.5 15 15 15h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8zM7.5 11h.01M10 7h.01M15 7h.01" />,
  chat: <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.2zM9 10h.01M12 10h.01M15 10h.01" />,
};

function Icon({ d }: { d: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      {d}
    </svg>
  );
}

/** Aceternity-style floating dock: icons magnify as the pointer nears them. */
export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const { count } = useOrder();
  const items: Item[] = [
    { title: "Home", href: "#top", icon: <Icon d={I.home} /> },
    { title: "The Switch", href: "#switch", icon: <Icon d={I.switch} /> },
    { title: "Flavours", href: "#flavours", icon: <Icon d={I.drop} /> },
    { title: "Colourways", href: "#colourways", icon: <Icon d={I.palette} /> },
    { title: "Pricing", href: "#pricing", icon: <Icon d={I.tag} /> },
    { title: "Contact", href: "#contact", icon: <Icon d={I.chat} /> },
  ];

  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-4 z-[500] flex justify-center px-3">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-16 items-end gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 pb-2.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,.8)] backdrop-blur-xl sm:gap-3"
      >
        {items.map((it) => (
          <DockIcon key={it.title} mouseX={mouseX} {...it} />
        ))}
        <div className="mx-0.5 h-8 w-px self-center bg-white/15" />
        <DockIcon
          mouseX={mouseX}
          title={count ? `Your stack · ${count}` : "Build your order"}
          href="#order"
          id="cart-target"
          accent
          icon={
            <div className="relative h-full w-full">
              <Icon d={<path d="M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0" />} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0, y: -6 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-zap px-1 text-[10px] font-black text-black"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          }
        />
      </motion.div>
    </nav>
  );
}

function DockIcon({ mouseX, title, href, icon, id, accent }: Item & { mouseX: MotionValue<number>; accent?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const dist = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return x - b.x - b.width / 2;
  });
  const size = useSpring(useTransform(dist, [-140, 0, 140], [42, 72, 42]), { mass: 0.1, stiffness: 160, damping: 12 });
  const inner = useSpring(useTransform(dist, [-140, 0, 140], [18, 32, 18]), { mass: 0.1, stiffness: 160, damping: 12 });

  return (
    <motion.a
      ref={ref}
      id={id}
      href={href}
      aria-label={title}
      style={{ width: size, height: size }}
      className={
        "group relative grid aspect-square place-items-center rounded-full " +
        (accent ? "bg-[var(--accent)] text-black shadow-[0_0_30px_var(--accent)]" : "bg-white/10 text-white hover:bg-white/15")
      }
    >
      <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100 sm:block">
        {title}
      </span>
      <motion.span style={{ width: inner, height: inner }} className="grid place-items-center">
        {icon}
      </motion.span>
    </motion.a>
  );
}
