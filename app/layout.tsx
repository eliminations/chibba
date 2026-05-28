import type { Metadata, Viewport } from "next";
import { Unbounded, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { CHIBBA } from "@/lib/constants";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { LoadingScreen } from "@/components/effects/loading-screen";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { Navbar } from "@/components/layout/navbar";
import { ScrollWheel } from "@/components/effects/scroll-wheel";
import { SoundProvider } from "@/components/providers/sound-provider";

// Display: Unbounded — loud, rounded-geometric poster face. Carries the
// gooner-cult voice at any size. Body: Hanken Grotesk — a warm, highly
// legible humanist grotesk that supports without competing.
const display = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHIBBA — Enter The Hive",
  description: CHIBBA.tagline,
  keywords: ["Chibba", "Goon Bee", "BZZ", "Solana", "memecoin", "hive", "NFT"],
  openGraph: {
    title: "CHIBBA — Enter The Hive",
    description: CHIBBA.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHIBBA — Enter The Hive",
    description: CHIBBA.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} dark`}>
      <body className="bg-void text-foreground">
        <SoundProvider>
          <LoadingScreen />
          <CustomCursor />
          <SmoothScrollProvider>
            <Navbar />
            {children}
            <ScrollWheel />
          </SmoothScrollProvider>
          {/* Signature atmosphere: living film grain + cinematic vignette */}
          <div aria-hidden className="grain-overlay" />
          <div aria-hidden className="vignette-overlay" />
        </SoundProvider>
      </body>
    </html>
  );
}
