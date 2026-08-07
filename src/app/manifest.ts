import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fouad & Demiana Wedding",
    short_name: "Wedding",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#6E1023",
    icons: [],
  };
}
