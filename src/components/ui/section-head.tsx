"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SectionHead({ tag, a, b, children, className, center }: {
  tag: string; a: string; b: string; children?: React.ReactNode; className?: string; center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("max-w-3xl", center && "mx-auto text-center", className)}
    >
      <span className="tag"><span>{tag}</span></span>
      <h2 className="display mt-5 text-5xl sm:text-7xl">
        <span className="block">{a}</span>
        <span className="block text-[var(--accent)] transition-colors duration-700">{b}</span>
      </h2>
      {children && <div className="mt-6 text-lg text-white/70">{children}</div>}
    </motion.div>
  );
}
