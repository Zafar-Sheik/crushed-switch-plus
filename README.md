# Crushed Switch+

Animated, interactive website for **Crushed Switch+**, the refillable pod vape system (South Africa, adults 18+).
Customers build an order on the page and send it to WhatsApp (+27 72 831 8698) with one tap.

## Stack

- **Next.js 16** (App Router, static prerender) + **Tailwind CSS v4**
- **GSAP 3** with ScrollTrigger, SplitText, ScrambleText, Draggable + Inertia, Physics2D
- **Motion** (`motion/react`) for layout animations, drag-and-drop and the floating dock
- **Lenis** smooth scrolling, synced to GSAP's ticker
- Aceternity-style components written in-house (`src/components/ui`): spotlight, 3D card, card spotlight, moving border, meteors, lamp, floating dock

## What's on the page

| Section | Interaction |
| --- | --- |
| Preloader + 18+ gate | Seven-segment "charging" counter in the style of the device's display; age confirmation is remembered |
| Hero | Draggable 3D ring of all 23 pods (inertia + snap). The selected flavour re-colours the whole site |
| Marquee | Flavour ribbons whose speed and skew follow scroll velocity |
| Who we are | Scroll-scrubbed word reveal, 3D tilt poster, spotlight cards |
| The Switch+ system | Pinned scroll scene: pods click in and out of the device, steps 01–03 track progress |
| Flavour library | Filter tabs, search, tilt cards, tap to fly a pod into the cart |
| Colourways | Lamp-lit showroom with 3D flip between the four device colours |
| Pricing | Moving-border price cards and a stack calculator with an animated LED total |
| The stack lab (order) | Kit station, drag-and-drop pod wall, flavour roulette, a printed till slip, live WhatsApp preview, and **Order on WhatsApp** |
| Finale | Raining pods, reasons to buy, contacts, health warning |

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
