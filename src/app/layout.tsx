import type { Metadata, Viewport } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Raleway,
} from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import "./globals.css";

// All four preloaded; payload kept small with latin only and fixed weights. See CLAUDE.md "Type".
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ocean Harmony Initiative",
    template: "%s | Ocean Harmony Initiative",
  },
  description:
    "Ocean literacy, storytelling, youth engagement and community-based conservation, starting in Winneba, Ghana.",
};

export const viewport: Viewport = {
  themeColor: "#f5f1ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${raleway.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link" data-shell-inert>
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} data-shell-inert className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
