import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fahed Mbarek // Full-Stack Software Engineer & AI Systems Portfolio",
    short_name: "Fahed Mbarek",
    description:
      "Interactive 3D portfolio and engineering platform of Fahed Mbarek — Software Engineer specializing in distributed microservices, Next.js, and AI systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ffd600",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
