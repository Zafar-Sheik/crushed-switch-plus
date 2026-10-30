"use client";

import { OrderProvider } from "@/lib/order";
import { SmoothScroll } from "./smooth-scroll";
import { Cursor } from "./cursor";
import { Preloader } from "./preloader";
import { Dock } from "./dock";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      {children}
      <Dock />
    </OrderProvider>
  );
}
