"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  KIT_PRICE,
  POD_PRICE,
  WHATSAPP_NUMBER,
  deviceById,
  flavourById,
  rand,
} from "./data";

export type Line =
  | { key: string; kind: "kit"; device: string; flavour: string; qty: number }
  | { key: string; kind: "pod"; flavour: string; qty: number };

export type Customer = { name: string; area: string; notes: string; delivery: "delivery" | "collect" };

type OrderCtx = {
  lines: Line[];
  count: number;
  total: number;
  customer: Customer;
  setCustomer: (c: Partial<Customer>) => void;
  addKit: (device: string, flavour: string, qty?: number) => void;
  addPod: (flavour: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  podQty: (flavour: string) => number;
  buildMessage: () => string;
  whatsappUrl: () => string;
  accent: string;
  setAccent: (c: string) => void;
};

const Ctx = createContext<OrderCtx | null>(null);
const STORAGE = "cs-order-v1";

export const linePrice = (l: Line) => (l.kind === "kit" ? KIT_PRICE : POD_PRICE) * l.qty;
export const lineLabel = (l: Line) =>
  l.kind === "kit"
    ? `Whole Kit · ${deviceById(l.device).name} + ${flavourById(l.flavour).name}`
    : `Pod · ${flavourById(l.flavour).name}`;

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [customer, setCustomerState] = useState<Customer>({
    name: "",
    area: "",
    notes: "",
    delivery: "delivery",
  });
  const [accent, setAccent] = useState("#b45cff");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const saved = JSON.parse(raw);
        // Restoring from localStorage must happen after hydration to match the server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(saved.lines)) setLines(saved.lines);
        if (saved.customer) setCustomerState((c) => ({ ...c, ...saved.customer }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ lines, customer }));
    } catch {}
  }, [lines, customer, hydrated]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  const setCustomer = useCallback(
    (c: Partial<Customer>) => setCustomerState((prev) => ({ ...prev, ...c })),
    []
  );

  const upsert = useCallback((key: string, make: () => Line, qty: number) => {
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, make()];
    });
  }, []);

  const addKit = useCallback(
    (device: string, flavour: string, qty = 1) => {
      const key = `kit:${device}:${flavour}`;
      upsert(key, () => ({ key, kind: "kit", device, flavour, qty }), qty);
    },
    [upsert]
  );

  const addPod = useCallback(
    (flavour: string, qty = 1) => {
      const key = `pod:${flavour}`;
      upsert(key, () => ({ key, kind: "pod", flavour, qty }), qty);
    },
    [upsert]
  );

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback((key: string) => setLines((p) => p.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + linePrice(l), 0);

  const podQty = useCallback(
    (flavour: string) => lines.find((l) => l.key === `pod:${flavour}`)?.qty ?? 0,
    [lines]
  );

  const buildMessage = useCallback(() => {
    const out: string[] = [];
    out.push("*NEW ORDER · CRUSHED SWITCH+* 🟣");
    out.push("");
    if (customer.name) out.push(`👤 *Name:* ${customer.name}`);
    out.push(
      customer.delivery === "delivery"
        ? `🚚 *Delivery to:* ${customer.area || "(area to confirm)"}`
        : "📍 *I'll collect*"
    );
    out.push("");
    out.push("*My stack:*");
    lines.forEach((l) => {
      out.push(`• ${l.qty} × ${lineLabel(l)}  —  ${rand(linePrice(l))}`);
    });
    out.push("");
    const kits = lines.filter((l) => l.kind === "kit").reduce((s, l) => s + l.qty, 0);
    const pods = lines.filter((l) => l.kind === "pod").reduce((s, l) => s + l.qty, 0);
    out.push(`Kits: ${kits}  ·  Extra pods: ${pods}`);
    out.push(`*TOTAL: ${rand(total)}*`);
    if (customer.notes.trim()) {
      out.push("");
      out.push(`📝 ${customer.notes.trim()}`);
    }
    out.push("");
    out.push("I confirm I am 18 or older.");
    return out.join("\n");
  }, [customer, lines, total]);

  const whatsappUrl = useCallback(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`,
    [buildMessage]
  );

  const value = useMemo(
    () => ({
      lines,
      count,
      total,
      customer,
      setCustomer,
      addKit,
      addPod,
      setQty,
      remove,
      clear,
      podQty,
      buildMessage,
      whatsappUrl,
      accent,
      setAccent,
    }),
    [lines, count, total, customer, setCustomer, addKit, addPod, setQty, remove, clear, podQty, buildMessage, whatsappUrl, accent]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOrder must be used inside OrderProvider");
  return v;
}
