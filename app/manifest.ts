import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KENALI — Edukasi & Perlindungan Diri Siswa",
    short_name: "KENALI",
    description:
      "Aplikasi edukasi interaktif berbasis video animasi dan mini game kesehatan reproduksi & pencegahan kekerasan seksual untuk siswa SMP Al-Falah Rempoa.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF7",
    theme_color: "#0d9488",
    orientation: "portrait",
    categories: ["education", "health", "games"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
