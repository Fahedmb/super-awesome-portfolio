import type { Metadata, Viewport } from "next";
import { Syne, Instrument_Serif, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fahedmbarek.com"),
  title: {
    default: "Fahed Mbarek // Full-Stack Software Engineer & AI Systems Architect",
    template: "%s | Fahed Mbarek",
  },
  description:
    "Official portfolio of Fahed Mbarek — National Engineering Diploma graduate and Data Science specialist. Engineering scalable Java/Spring Boot microservices, high-performance Next.js web applications, and AI integrations.",
  applicationName: "Fahed Mbarek Portfolio",
  authors: [
    {
      name: "Fahed Mbarek",
      url: "https://fahedmbarek.com",
    },
  ],
  generator: "Next.js",
  keywords: [
    "Fahed Mbarek",
    "Fahed Mbarek Software Engineer",
    "Fahed Mbarek Portfolio",
    "Fahed Mbarek Full-Stack",
    "Fahed Mbarek Tunisia",
    "Fahed Mbarek TEK-UP",
    "Fahed Mbarek AI",
    "Fahed Mbarek Java",
    "Fahed Mbarek Spring Boot",
    "Fahed Mbarek Next.js",
    "Fahed Mbarek React",
    "Fahed Mbarek Data Science",
    "Software Engineer Tunisia",
    "Distributed Systems Architect",
    "Full-Stack Web Developer",
    "CertifUp",
    "CPG TMS",
    "YAZAKI Talent Platform",
  ],
  creator: "Fahed Mbarek",
  publisher: "Fahed Mbarek",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://fahedmbarek.com",
  },
  openGraph: {
    type: "profile",
    firstName: "Fahed",
    lastName: "Mbarek",
    username: "fahedmb",
    gender: "male",
    url: "https://fahedmbarek.com",
    title: "Fahed Mbarek // Full-Stack Software Engineer & AI Systems Architect",
    description:
      "Explore the interactive 3D portfolio of Fahed Mbarek — Full-Stack Software Engineer specializing in distributed Java microservices, modern Next.js architectures, and AI systems.",
    siteName: "Fahed Mbarek Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fahed Mbarek — Full-Stack Software Engineer & AI Systems Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fahed Mbarek // Full-Stack Software Engineer & AI Systems Architect",
    description:
      "Interactive 3D portfolio and engineering showcase of Fahed Mbarek — Full-Stack Software Engineer specializing in distributed systems, Next.js, and AI.",
    creator: "@fahedmb",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Software Engineering Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-black text-neutral-100 selection:bg-yellow-400 selection:text-black">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
