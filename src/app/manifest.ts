import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fouad & Demiana Wedding",
    short_name: "Wedding",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EF",
    theme_color: "#F3EADD",
    icons: [],
  };
}
