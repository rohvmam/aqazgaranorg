import { JetBrains_Mono, Manrope, Noto_Sans_SC, Sora, Vazirmatn } from "next/font/google";
import localFont from "next/font/local";

export const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
  display: "swap",
});

export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazir",
  display: "swap",
});

/** Persian display face — variable font, self-hosted (not on Google Fonts). */
export const estedad = localFont({
  src: "../fonts/estedad-var.woff2",
  weight: "100 900",
  variable: "--font-estedad",
  display: "swap",
});

export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sc",
  display: "swap",
});

export const fontVariables = [
  sora.variable,
  manrope.variable,
  jbMono.variable,
  vazirmatn.variable,
  estedad.variable,
  notoSansSC.variable,
].join(" ");
