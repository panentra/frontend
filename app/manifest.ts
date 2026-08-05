import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Panentra — Menghubungkan Panen dengan Peluang",
    short_name: "Panentra",
    description:
      "Marketplace agrotech & smart farming: transparansi harga, rekomendasi AI, dan kalender pertanian untuk petani & pemasok Indonesia.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F7F9F7",
    theme_color: "#1B5E20",
    lang: "id",
    categories: ["business", "shopping", "productivity"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
