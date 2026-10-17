import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

/** Heading & game-title font (playful, rounded). Exposed as `font-display`. */
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

/** Body font for scenarios, stories, and diary entries. Exposed as `font-sans`. */
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KENALI — Kenali Dirimu, Lindungi Dirimu",
    template: "%s | KENALI",
  },
  description:
    "Aplikasi edukasi interaktif berbasis video animasi dan mini game tentang kesehatan reproduksi serta pencegahan kekerasan seksual untuk siswa SMP.",
};

export const viewport: Viewport = {
  themeColor: "#FFFDF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF7] text-slate-800 font-sans font-medium">
        {children}
      </body>
    </html>
  );
}
