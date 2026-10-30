# Crushed Switch+

Animated, interactive website for **Crushed Switch+**, the refillable pod vape system (South Africa, adults 18+).
Customers build an order on the page and send it to WhatsApp (+27 72 831 8698) with one tap.

## Stack

- **Next.js 16** (App Router, static prerender) + **Tailwind CSS v4**
- **Motion** (`motion/react`) for fade-ins, layout animations, drag-and-drop and the floating dock
- **GSAP 3** for small click-driven effects (fly-to-cart, roulette spin, confetti, number count-ups)
- Aceternity-style components written in-house (`src/components/ui`): 3D card, card spotlight, moving border, lamp, floating dock

Animations are deliberately calm: nothing hijacks scrolling, content fades in once, and every bigger effect is triggered by a click or tap.

## What's on the page

| Section | Interaction |
| --- | --- |
| 18+ gate | Shown once; remembered per browser |
| Hero | Headline and prices, plus a "try a flavour" panel: tap a colour to swap the pod. The chosen flavour tints the site |
| Marquee | Slow ribbon of flavour names (pauses on hover) |
| Who we are | Copy, tilt poster, mission/vision and four pillars |
| The Switch+ system | Three step cards: get the kit, pick a flavour, switch it up |
| Flavour library | Filter tabs, search, tap to fly a pod into the cart |
| Colourways | Lamp-lit showroom, flip between the four device colours |
| Pricing | Price cards and a stack calculator with an LED total |
| The stack lab (order) | Kit station, drag-and-drop or tap pod wall, flavour roulette, till slip, live WhatsApp preview, and **Order on WhatsApp** |
| Finale | Classics line-up, reasons to buy, contacts, health warning |

The order is kept in `localStorage`, so it survives a refresh. Pressing **Order on WhatsApp** opens
`https://wa.me/27728318698?text=…` with the full order (name, delivery or collection, every line, totals and notes) already filled in.

## Editing content

All business data lives in `src/lib/data.ts`: prices, WhatsApp number, socials, flavours (name, category, colour) and device colourways.
Product images are in `public/products/` (cut out from the supplied photos). The ten "classics" pods without
photography were generated from a real pod photo and tinted to match the flavour line-up artwork.

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build && npm start
```
