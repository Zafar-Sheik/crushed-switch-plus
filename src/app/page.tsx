import { Providers } from "@/components/providers";
import { Hero } from "@/components/sections/hero";
import { FlavourMarquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { SwitchSystem } from "@/components/sections/switch-system";
import { Colourways } from "@/components/sections/colourways";
import { FlavourLibrary } from "@/components/sections/flavour-library";
import { Pricing } from "@/components/sections/pricing";
import { OrderBuilder } from "@/components/sections/order-builder";
import { Finale } from "@/components/sections/finale";

export default function Home() {
  return (
    <Providers>
      <main>
        <Hero />
        <FlavourMarquee />
        <About />
        <SwitchSystem />
        <FlavourLibrary />
        <Colourways />
        <Pricing />
        <OrderBuilder />
        <Finale />
      </main>
    </Providers>
  );
}
