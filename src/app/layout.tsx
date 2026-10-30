import type { Metadata, Viewport } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Crushed Switch+ · Bigger Flavours. Bolder Vibes.",
  description:
    "One device. 20+ flavours. Zero boring. Crushed Switch+ refillable pod vapes in South Africa: whole kit R150, pods R90. Build your stack and order on WhatsApp. Adults 18+ only.",
  openGraph: {
    title: "Crushed Switch+",
    description: "One device. 20+ flavours. Zero boring. Build your stack and order on WhatsApp.",
    images: ["/brand/banner.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07040c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${poppins.variable} ${mono.variable} antialiased`}>
      <body className="grain min-h-screen font-sans">{children}</body>
    </html>
  );
}
