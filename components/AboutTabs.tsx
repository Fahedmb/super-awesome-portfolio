"use client";

import React, { useState } from "react";
import EasterEggDecoder from "./EasterEggDecoder";
import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTitle,
} from "@/components/reui/timeline";
import { cn } from "@/lib/utils";
import {
  Code2,
  Cpu,
  Layers,
  GraduationCap,
  Dumbbell,
  Music,
  Gamepad2,
  Orbit,
  HelpCircle,
  BookOpen,
  Film,
  Swords,
  Calendar,
  Flame,
  Zap,
  Quote,
  Compass,
  Lightbulb,
  Video,
  ExternalLink,
  Eye,
  Lock,
  Server,
  Terminal,
  CheckCircle2,
} from "lucide-react";

// Crisp SVG Youtube Icon
function YoutubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface AboutTabsProps {
  onNavigateToOrigin?: () => void;
  onNavigateToWorks?: () => void;
}

export default function AboutTabs({}: AboutTabsProps) {
  const [activeTab, setActiveTab] = useState<"core" | "manifesto" | "roadmap" | "hobbies" | "qa" | "youtube">("core");

  // Short, clear, meaningful tab titles that fit on one line effortlessly
  const tabs = [
    { id: "core", label: "CORE", icon: Code2 },
    { id: "manifesto", label: "PHILOSOPHY", icon: Quote },
    { id: "roadmap", label: "ROADMAP", icon: GraduationCap },
    { id: "hobbies", label: "HOBBIES", icon: Dumbbell },
    { id: "qa", label: "Q&A", icon: HelpCircle },
    { id: "youtube", label: "CHANNELS", icon: Video },
  ] as const;

  // Engineering Philosophy Principles (Harmonized in shades of yellow & gold)
  const philosophyItems = [
    {
      number: "01",
      title: "Deep Domain Understanding",
      tagline: "Understand the problem deeply before writing a single line of code.",
      description: "Code is the final artifact of understanding. Rushing into implementation before defining boundary conditions, domain models, and failure modes guarantees technical debt. Clarity of thought yields effortless architecture.",
      icon: Compass,
      accent: "text-yellow-400",
    },
    {
      number: "02",
      title: "Eliminate Before Optimizing",
      tagline: "The #1 mistake of a smart engineer is optimizing what shouldn't exist in the first place.",
      description: "Question every requirement and eliminate unnecessary abstractions before tuning performance. The fastest code with zero bugs is the code you never write and never have to maintain.",
      icon: Zap,
      accent: "text-amber-400",
    },
    {
      number: "03",
      title: "Functional First, Polish Second",
      tagline: "First make it work, then make it right, then make it fast & elegant.",
      description: "Build an end-to-end working pipeline first to validate technical feasibility against real-world data, then refactor ruthlessly for clean separation of concerns, modularity, and speed.",
      icon: Lightbulb,
      accent: "text-yellow-300",
    },
    {
      number: "04",
      title: "Radical Simplicity & Modularity",
      tagline: "Complexity must be minimized at all costs — simplest is always best.",
      description: "Architect systems to be scalable and modular, but avoid speculative over-engineering. In production, simple and decoupled components are easier to debug, test, and maintain over years.",
      icon: Layers,
      accent: "text-amber-300",
    },
    {
      number: "05",
      title: "The Truth on Imposter Syndrome & Growth",
      tagline: "Feeling lost is normal in an evolving field. Rapid adaptability is the real superpower.",
      description: "Imposter syndrome is just discomfort with unfamiliar territory. In an exponential industry like software, if you know everything you're doing, you aren't innovating. The defining superpower of an exceptional engineer is not knowing everything upfront, but the relentless hunger to learn, adapt, and take autonomous initiative.",
      icon: Flame,
      accent: "text-yellow-400",
    },
  ];

  // Alternating Milestones (Shadcn pattern matching the reference screenshot)
  const roadmapItems = [
    {
      id: 1,
      date: "2019",
      title: "Baccalauréat in CS",
      institution: "Lycée Houcine Bouzaiene (L.H.B.G)",
      description: "Graduated with honors in CS, building algorithms & logic foundations.",
      badge: "HONORS",
    },
    {
      id: 2,
      date: "2019 – 2022",
      title: "Licence Appliquée en DSI",
      institution: "ISET Gafsa",
      description: "Information systems, Java OOP, database design & web architectures.",
      badge: "DSI LICENCE",
    },
    {
      id: 3,
      date: "2022 – 2023",
      title: "Master's in Data Science (M1)",
      institution: "ISSAT Gafsa",
      description: "Python data science, statistical modeling & machine learning.",
      badge: "DATA SCIENCE",
    },
    {
      id: 4,
      date: "2022 – 2025",
      title: "National Engineering Diploma",
      institution: "TEK-UP Ariana, Tunis",
      description: "Software Architecture, Distributed Systems, Microservices & OpenAPI.",
      badge: "INGÉNIEUR",
    },
    {
      id: 5,
      date: "2022 – PRESENT",
      title: "Freelance Full-Stack Engineer",
      institution: "Global Remote Clients (3+ Yrs)",
      description: "Delivering 15+ custom platforms, REST microservices & AI integrations.",
      badge: "15+ PLATFORMS",
    },
  ];

  // Hobbies & Passions
  const hobbiesList = [
    {
      title: "Boxing, MMA & Heavy Strength Training",
      category: "COMBAT SPORTS & PHYSICAL RIGOR",
      icon: Swords,
      accent: "text-amber-400",
      description: "Passionate practitioner of boxing, Mixed Martial Arts, and heavy lifting. Builds composure under pressure, physical stamina, and mental toughness that translates directly to complex debugging.",
      tags: ["Boxing", "MMA", "Strength Training", "Mental Toughness", "Discipline"],
    },
    {
      title: "Music Production & Beatmaking",
      category: "CREATIVE SOUND ARCHITECTURE",
      icon: Music,
      accent: "text-yellow-400",
      description: "Music producer sculpting drum arrangements, analog synths, and acoustic dynamics. Deeply inspired by pioneering producers who redefine audio landscapes.",
      tags: ["Beatmaking", "Analog Synths", "Pharrell Williams", "Nick Mira", "Audio Mixing"],
    },
    {
      title: "Competitive Gaming & Strategy",
      category: "MECHANICAL REFLEXES & TACTICS",
      icon: Gamepad2,
      accent: "text-amber-300",
      description: "High-intensity competitive gamer focusing on fast decision-making and mechanical execution under pressure.",
      tags: ["League of Legends", "Riven Main", "Vayne", "Kayn", "Tactical Focus"],
    },
    {
      title: "Astrophysics & Cosmic Mechanics",
      category: "UNIVERSE LAWS & RELATIVITY",
      icon: Orbit,
      accent: "text-yellow-300",
      description: "Fascinated by general relativity, orbital mechanics, and gravitational lensing. Applying fundamental cosmic order to distributed systems design.",
      tags: ["Astrophysics", "General Relativity", "Cosmology", "Simulations"],
    },
  ];

  // Q&A Items (Vertical List with Real Hover-to-Reveal)
  const qaList = [
    {
      id: "age-origin",
      question: "When and where were you born?",
      answer: "Born on November 14, 2000 in Gafsa, Tunisia (25 years old).",
      icon: Calendar,
      category: "IDENTITY",
    },
    {
      id: "why-cs",
      question: "Why did you choose Computer Science?",
      answer: "Because it's the ultimate modern craft where you can turn pure ideas into scalable reality through code.",
      icon: Flame,
      category: "PURPOSE",
    },
    {
      id: "fav-subject",
      question: "What was your favorite subject in school?",
      answer: "Physics — understanding the underlying mathematical laws of the universe and applying them with rigor.",
      icon: Orbit,
      category: "FOUNDATIONS",
    },
    {
      id: "fav-producers",
      question: "Who are your favorite music producers?",
      answer: "Pharrell Williams and Nick Mira.",
      icon: Music,
      category: "SOUNDTRACK",
    },
    {
      id: "fav-fighters",
      question: "Who are your favorite UFC & MMA fighters?",
      answer: "Demetrious 'Mighty Mouse' Johnson, Jon Jones, Georges St-Pierre (GSP), Anderson Silva, and Islam Makhachev.",
      icon: Swords,
      category: "MARTIAL ARTS",
    },
    {
      id: "lol-mains",
      question: "What are your League of Legends mains?",
      answer: "Riven, Vayne, and Kayn (high skill-ceiling champions demanding precision and timing).",
      icon: Gamepad2,
      category: "GAMING",
    },
    {
      id: "book-rec",
      question: "What book do you recommend most?",
      answer: "1984 by George Orwell — a timeless masterclass on systems, power, and perception.",
      icon: BookOpen,
      category: "LITERATURE",
    },
    {
      id: "fav-movie",
      question: "What is your favorite movie?",
      answer: "In Time (alongside Christopher Nolan's Interstellar).",
      icon: Film,
      category: "CINEMA",
    },
  ];

  // Favorite YouTube Channels
  const youtubeChannels = [
    {
      name: "Veritasium",
      creator: "Derek Muller",
      category: "PHYSICS & COUNTER-INTUITIVE TRUTHS",
      description: "Exceptional visual deep-dives into physics, quantum mechanics, and counter-intuitive phenomena in nature and science.",
      highlight: "Mind-bending physical proofs & scientific experiments",
      link: "https://www.youtube.com/@veritasium",
    },
    {
      name: "Vsauce",
      creator: "Michael Stevens",
      category: "PHILOSOPHICAL & SCIENTIFIC INQUIRY",
      description: "Deep philosophical and mathematical explorations questioning human perception, spatial reality, and logic.",
      highlight: "Existential questions & cognitive deep dives",
      link: "https://www.youtube.com/@Vsauce",
    },
    {
      name: "Smarter Every Day",
      creator: "Destin Sandlin",
      category: "APPLIED ENGINEERING & MECHANICS",
      description: "Hands-on aerospace, fluid dynamics, and high-speed mechanical engineering through sheer curiosity and rigorous testing.",
      highlight: "High-speed camera telemetry & aerospace physics",
      link: "https://www.youtube.com/@smartereveryday",
    },
    {
      name: "Michael Reeves",
      creator: "Michael Reeves",
      category: "ROBOTICS & CHAOTIC PROGRAMMING",
      description: "Hilarious and chaotic robotic engineering, microcontroller programming, computer vision, and hands-on hardware hacking.",
      highlight: "Unorthodox coding, computer vision & hardware inventions",
      link: "https://www.youtube.com/@MichaelReeves",
    },
  ];

  return (
    <div className="w-full">
      {/* Centered, Compact, Single-Line Glass Tab Switcher with Mobile Horizontal Scroll */}
      <div className="flex justify-start sm:justify-center mb-2.5 max-w-full overflow-x-auto no-scrollbar py-0.5 px-0.5">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/85 border border-white/15 backdrop-blur-2xl shadow-xl flex-nowrap shrink-0 mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] font-mono font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#FFD600] text-black shadow-md shadow-yellow-400/25 font-extrabold"
                    : "text-neutral-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-black" : "text-yellow-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Content Container without artificial height clamp */}
      <div className="space-y-2.5 sm:space-y-3 relative">
        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: DEDICATED REBRANDED ENGINEERING CORE (Harmonized Yellows)    */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === "core" && (
          <div key="core" className="space-y-3 animate-tab-switch">
          {/* Header Banner */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-yellow-400">
              <Terminal className="w-3.5 h-3.5 text-yellow-400" />
              <span>TECHNICAL DOMAINS // WHAT I ARCHITECT &amp; SHIP</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              PRODUCTION STACK
            </span>
          </div>

          {/* 3 Rebranded Architectural Cards — All Unified in Distinct Shades of Yellow & Gold */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Card 1: Distributed Backends & Microservices (Electric Yellow #FFD600) */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-yellow-400/40 hover:border-yellow-400/70 transition-all backdrop-blur-xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-400/15 border border-yellow-400/30 text-yellow-300">
                    ENTERPRISE BACKEND
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-display mb-1">
                  Distributed Java &amp; Microservices
                </h3>

                <p className="text-[11px] text-neutral-300 font-light leading-relaxed mb-3">
                  Architecting resilient microservice clusters, high-concurrency REST/WebSocket endpoints,
                  and zero-trust authentication pipelines.
                </p>

                <div className="space-y-1 mb-3 text-[10px] text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>Sub-100ms API response latency</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>Redis caching reducing DB load &gt;70%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>Zero-trust BCrypt + AES-256 vaults</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 border-t border-white/10 pt-2.5">
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-yellow-300 font-semibold">
                  Java 21 / Spring Boot 4
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-300">
                  STOMP WebSockets
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-300">
                  Redis
                </span>
              </div>
            </div>

            {/* Card 2: AI & Data Science Engineering (Warm Golden Amber) */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-400/40 hover:border-amber-400/70 transition-all backdrop-blur-xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/15 border border-amber-400/30 text-amber-300">
                    AI &amp; DATA SYSTEMS
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-display mb-1">
                  Intelligent AI &amp; Data Engineering
                </h3>

                <p className="text-[11px] text-neutral-300 font-light leading-relaxed mb-3">
                  Integrating machine learning models, custom LLM workflows, relational schema tuning,
                  and high-volume enterprise ETL engines.
                </p>

                <div className="space-y-1 mb-3 text-[10px] text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>LLM APIs &amp; automated parsing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>100% data fidelity spreadsheet ETL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>PostgreSQL relational indexing</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 border-t border-white/10 pt-2.5">
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-amber-300 font-semibold">
                  Python / TensorFlow
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-300">
                  PostgreSQL
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-300">
                  Apache POI
                </span>
              </div>
            </div>

            {/* Card 3: Full-Stack Architecture & DevOps (Radiant Deep Gold) */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-yellow-500/40 hover:border-yellow-500/70 transition-all backdrop-blur-xl flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
                    WEB &amp; DEVOPS
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white font-display mb-1">
                  Full-Stack Architecture &amp; DevOps
                </h3>

                <p className="text-[11px] text-neutral-300 font-light leading-relaxed mb-3">
                  Crafting cinematic, sub-second web platforms with Server Components, 60 FPS WebGL canvas rendering,
                  and automated containerized CI/CD delivery pipelines.
                </p>

                <div className="space-y-1 mb-3 text-[10px] text-neutral-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>60 FPS render &amp; sub-second Web Vitals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>Strict TypeScript domain boundaries</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-yellow-400 shrink-0" />
                    <span>Docker &amp; Jenkins automation</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 border-t border-white/10 pt-2.5">
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-yellow-300 font-semibold">
                  Next.js 15 / React 19
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-300">
                  Angular 22
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-neutral-300">
                  Docker / CI/CD
                </span>
              </div>
            </div>
          </div>

          {/* Impact Telemetry Counter Row (Harmonized Yellow / Amber Shades) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-bold font-mono text-yellow-400">3+ YRS</div>
              <div className="text-[9px] font-mono text-neutral-400">FREELANCE DELIVERY</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-bold font-mono text-amber-300">15+</div>
              <div className="text-[9px] font-mono text-neutral-400">PLATFORMS SHIPPED</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-sm sm:text-base font-bold font-mono text-yellow-500">&gt;85%</div>
              <div className="text-[9px] font-mono text-neutral-400">TURNAROUND CUT</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400">88%</div>
              <div className="text-[9px] font-mono text-neutral-400">TEST COVERAGE</div>
            </div>
          </div>

          <EasterEggDecoder />
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: DEDICATED PHILOSOPHY & MINDSET MANIFESTO                     */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "manifesto" && (
        <div key="manifesto" className="space-y-3 animate-tab-switch">
          <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-yellow-400">
                <Quote className="w-4 h-4 text-yellow-400" />
                <span>ENGINEERING MANIFESTO // MINDSET &amp; FIRST PRINCIPLES</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300/80">
                5 CORE PRINCIPLES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {philosophyItems.map((phil, idx) => {
                const Icon = phil.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/40 transition-all ${
                      idx === 4 ? "md:col-span-2 bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-transparent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${phil.accent}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono font-bold text-yellow-400">
                            {phil.number}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                            {phil.title}
                          </h4>
                        </div>
                        <div className="text-[11px] font-mono text-yellow-300/90 font-semibold mb-1.5">
                          &ldquo;{phil.tagline}&rdquo;
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                          {phil.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: ACADEMIC ROADMAP (Alternating Shadcn Pattern)                */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "roadmap" && (
        <div key="roadmap" className="animate-tab-switch p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <div className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              <span>ACADEMIC &amp; CAREER TIMELINE // VERIFIED MILESTONES</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              5 MILESTONES
            </span>
          </div>

          <Timeline defaultValue={5}>
            {roadmapItems.map((item, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <TimelineItem key={item.id} step={item.id}>
                  <TimelineIndicator />

                  <div
                    className={cn(
                      "w-[calc(50%-1.25rem)] flex flex-col group/card transition-all",
                      isEven
                        ? "mr-auto text-right pr-2"
                        : "ml-auto text-left pl-2"
                    )}
                  >
                    <TimelineHeader className={isEven ? "items-end" : "items-start"}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <TimelineDate>{item.date}</TimelineDate>
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-semibold bg-neutral-800 border border-neutral-700 text-neutral-300">
                          {item.badge}
                        </span>
                      </div>
                      <TimelineTitle>{item.title}</TimelineTitle>
                    </TimelineHeader>

                    <div className="text-[10px] font-mono text-amber-300/90 font-medium mt-0.5">
                      {item.institution}
                    </div>

                    <p className="text-[10px] text-neutral-400 font-light leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </TimelineItem>
              );
            })}
          </Timeline>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: HOBBIES & RIGOR                                             */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "hobbies" && (
        <div key="hobbies" className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-tab-switch">
          {hobbiesList.map((hobby, idx) => {
            const Icon = hobby.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-yellow-400/40 transition-all backdrop-blur-xl group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-4 h-4 ${hobby.accent}`} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                      {hobby.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                      {hobby.title}
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 font-light leading-relaxed mb-2.5">
                  {hobby.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {hobby.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-mono text-neutral-400 group-hover:text-yellow-300 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 5: INTEL & Q&A                                                 */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "qa" && (
        <div key="qa" className="animate-tab-switch p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
          <div className="text-xs font-mono font-bold text-yellow-400 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-400" />
              <span>CLASSIFIED DOSSIER // FREQUENT INQUIRIES</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-normal">
              HOVER TO REVEAL TELEMETRY
            </span>
          </div>

          <div className="space-y-2">
            {qaList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative p-3 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/40 hover:bg-neutral-900/90 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-yellow-400" />
                      </div>
                      <span className="text-xs font-bold text-neutral-200 group-hover:text-white font-display">
                        {item.question}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-neutral-500 tracking-wider">
                        {item.category}
                      </span>
                      <div className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-yellow-400 group-hover:bg-yellow-400/10 transition-all">
                        <Lock className="w-3 h-3 group-hover:hidden" />
                        <Eye className="w-3 h-3 hidden group-hover:block text-yellow-400" />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <div className="mt-2 pt-2 border-t border-white/10 text-[11px] font-mono text-yellow-300 leading-relaxed flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">↳ DECLASSIFIED:</span>
                      <span>{item.answer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 6: FAVORITE YOUTUBE CHANNELS & MINDS                            */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "youtube" && (
        <div key="youtube" className="animate-tab-switch p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl">
          <div className="text-xs font-mono font-bold text-yellow-400 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span>INTELLECTUAL INSPIRATION // RECOMMENDED CHANNELS</span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">
              CURATED MINDS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {youtubeChannels.map((chan, idx) => (
              <a
                key={idx}
                href={chan.link}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/40 hover:bg-neutral-900/80 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                        <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white font-display group-hover:text-yellow-400 transition-colors">
                          {chan.name}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {chan.creator}
                        </span>
                      </div>
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-yellow-400 transition-colors" />
                  </div>

                  <span className="inline-block text-[9px] font-mono text-amber-300/80 font-semibold mb-1.5">
                    {chan.category}
                  </span>

                  <p className="text-[11px] text-neutral-300 font-light leading-relaxed mb-2">
                    {chan.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-yellow-400/20 group-hover:text-yellow-300/90 transition-all">
                  ★ {chan.highlight}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
