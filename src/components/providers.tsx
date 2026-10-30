"use client";

import { OrderProvider } from "@/lib/order";
import { Preloader } from "./preloader";
import { Dock } from "./dock";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <Preloader />
      {children}
      <Dock />
    </OrderProvider>
  );
}
