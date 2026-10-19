import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { DemoRoleSwitcher } from "@/components/demo-role-switcher";
import "./globals.css";

/** Heading & game-title font (playful, rounded). Exposed as `font-display`. */
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Body font for scenarios, stories, and diary entries. Exposed as `font-sans`. */
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "KENALI — Kenali Dirimu, Lindungi Dirimu",
    template: "%s | KENALI",
  },
  description:
    "Aplikasi edukasi interaktif berbasis video animasi dan mini game tentang kesehatan reproduksi serta pencegahan kekerasan seksual untuk siswa SMP.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFDF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFDF7] text-slate-800 font-sans font-medium">
        {children}
        <DemoRoleSwitcher />
      </body>
    </html>
  );
}
