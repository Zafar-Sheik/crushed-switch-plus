export const WHATSAPP_NUMBER = "27728318698";
export const WHATSAPP_DISPLAY = "+27 72 831 8698";
export const CONTACT_NAME = "Azhar";
export const INSTAGRAM = "m.a.e_habibi11";
export const TIKTOK = "that_tallguy101";

export const KIT_PRICE = 150;
export const POD_PRICE = 90;

export type CategoryId = "fruit" | "berry" | "ice" | "classics";

export const CATEGORIES: { id: CategoryId; name: string; blurb: string }[] = [
  { id: "fruit", name: "Fruit Fusion", blurb: "Sun-ripe and juicy" },
  { id: "berry", name: "Berry Blast", blurb: "Deep, dark and sweet" },
  { id: "ice", name: "Ice, Sour & Energy", blurb: "Cold, sharp, switched on" },
  { id: "classics", name: "The Classics", blurb: "The line-up keeps growing" },
];

export type Flavour = {
  id: string;
  name: string;
  category: CategoryId;
  color: string;
  notes: string[];
};

export const FLAVOURS: Flavour[] = [
  { id: "mexican-mango", name: "Mexican Mango", category: "fruit", color: "#e08a16", notes: ["Mango", "Tropical"] },
  { id: "pineapple-passionfruit", name: "Pineapple Passionfruit", category: "fruit", color: "#e8bb7c", notes: ["Pineapple", "Passionfruit"] },
  { id: "cherry-pomegranate", name: "Cherry Pomegranate", category: "fruit", color: "#c94f76", notes: ["Cherry", "Pomegranate"] },
  { id: "raspberry-grape", name: "Raspberry Grape", category: "fruit", color: "#c92a3a", notes: ["Raspberry", "Grape"] },
  { id: "blueberry-cherry-cranberry", name: "Blueberry Cherry Cranberry", category: "berry", color: "#8a4a86", notes: ["Blueberry", "Cherry", "Cranberry"] },
  { id: "strawberry-blueberry", name: "Strawberry Blueberry", category: "berry", color: "#1a74bd", notes: ["Strawberry", "Blueberry"] },
  { id: "sweet-berry", name: "Sweet Berry", category: "berry", color: "#e8b8ae", notes: ["Mixed berry", "Sweet"] },
  { id: "blue-sour-raspberry", name: "Blue Sour Raspberry", category: "berry", color: "#4f6ab3", notes: ["Raspberry", "Sour"] },
  { id: "peach-ice", name: "Peach Ice", category: "ice", color: "#e08c78", notes: ["Peach", "Icy"] },
  { id: "cherry-slush", name: "Cherry Slush", category: "ice", color: "#e0406f", notes: ["Cherry", "Slushy"] },
  { id: "miami-mint", name: "Miami Mint", category: "ice", color: "#6fd0c6", notes: ["Mint", "Cool"] },
  { id: "sour-apple", name: "Sour Apple", category: "ice", color: "#8fc22a", notes: ["Apple", "Sour"] },
  { id: "redbull", name: "Redbull", category: "classics", color: "#e2524f", notes: ["Energy"] },
  { id: "strawberry-blast", name: "Strawberry Blast", category: "classics", color: "#e5323f", notes: ["Strawberry"] },
  { id: "watermelon-ice", name: "Watermelon Ice", category: "classics", color: "#ef3f8a", notes: ["Watermelon", "Icy"] },
  { id: "mango-ice", name: "Mango Ice", category: "classics", color: "#f28a1a", notes: ["Mango", "Icy"] },
  { id: "pineapple-ice", name: "Pineapple Ice", category: "classics", color: "#f2cd2c", notes: ["Pineapple", "Icy"] },
  { id: "green-apple", name: "Green Apple", category: "classics", color: "#66c23a", notes: ["Apple"] },
  { id: "blue-razz", name: "Blue Razz", category: "classics", color: "#1da3df", notes: ["Blue raspberry"] },
  { id: "grape-ice", name: "Grape Ice", category: "classics", color: "#8a4ce0", notes: ["Grape", "Icy"] },
  { id: "cola", name: "Cola", category: "classics", color: "#7a3a82", notes: ["Cola"] },
  { id: "vanilla-custard", name: "Vanilla Custard", category: "classics", color: "#a8703f", notes: ["Vanilla", "Creamy"] },
  { id: "mint-ice", name: "Mint Ice", category: "classics", color: "#27c2ad", notes: ["Mint", "Icy"] },
];

export const flavourById = (id: string) => FLAVOURS.find((f) => f.id === id)!;
export const podSrc = (id: string) => `/products/${id}.webp`;

export type Device = { id: string; name: string; color: string; glow: string; pod: string };

export const DEVICES: Device[] = [
  { id: "white", name: "Arctic White", color: "#e9e9ef", glow: "#b18cff", pod: "blueberry-cherry-cranberry" },
  { id: "red", name: "Crimson Red", color: "#b5262b", glow: "#ff4d55", pod: "redbull" },
  { id: "black", name: "Midnight Black", color: "#1d1d22", glow: "#6fd0c6", pod: "miami-mint" },
  { id: "blue", name: "Ocean Blue", color: "#2185ad", glow: "#ffe14d", pod: "pineapple-ice" },
];

export const deviceById = (id: string) => DEVICES.find((d) => d.id === id)!;
export const deviceSrc = (id: string) => `/products/device-${id}.webp`;

export const rand = (n: number) => `R${n.toLocaleString("en-ZA")}`;
