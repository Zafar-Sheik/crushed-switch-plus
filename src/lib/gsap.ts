"use client";

import gsap from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Physics2DPlugin);
}

export { gsap };
