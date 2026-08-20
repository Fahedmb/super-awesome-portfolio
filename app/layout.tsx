import type { Metadata } from "next";
import { Syne, Instrument_Serif, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Fahed Mbarek // Full-Stack Software Engineer | AI & Intelligent Systems",
  description:
    "Portfolio of Fahed Mbarek — National Engineering Diploma graduate with freelance delivery and enterprise experience across Java/Spring Boot microservices, Next.js/React platforms, and AI systems.",
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
      <body className="min-h-full flex flex-col font-sans bg-black text-neutral-100 selection:bg-yellow-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
