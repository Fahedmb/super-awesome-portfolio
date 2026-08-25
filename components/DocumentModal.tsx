"use client";

import React, { useState, useEffect } from "react";
import { FileDown, ExternalLink, FileText, Check, X } from "lucide-react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLang?: "ENG" | "FR";
}

export default function DocumentModal({
  isOpen,
  onClose,
  initialLang = "ENG",
}: DocumentModalProps) {
  const [lang, setLang] = useState<"ENG" | "FR">(initialLang);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const docs = {
    ENG: {
      title: "Official Documents & Credentials",
      subtitle: "Select and download Fahed Mbarek's Resume or Motivation Letter.",
      langLabel: "Language:",
      resume: {
        title: "Resume / Curriculum Vitae",
        filename: "Resume_Fahed_Mbarek.pdf",
        url: "/Resumes/ENG/Resume_Fahed_Mbarek.pdf",
        desc: "Full-Stack Software Engineer • Distributed Backends, AI & Modern Web",
        badge: "PDF • ATS-OPTIMIZED • 2026",
      },
      letter: {
        title: "Motivation Letter",
        filename: "Motivation_Letter_Fahed_Mbarek.pdf",
        url: "/Resumes/ENG/Motivation_Letter_Fahed_Mbarek.pdf",
        desc: "Targeted Professional Cover Letter • Engineering & AI Systems",
        badge: "PDF • OFFICIAL DISPATCH • 2026",
      },
      downloadBtn: "Download PDF",
      viewBtn: "View in Browser",
      closeBtn: "Close",
    },
    FR: {
      title: "Documents Officiels & Candidature",
      subtitle: "Consultez et téléchargez le CV ou la Lettre de Motivation de Fahed Mbarek.",
      langLabel: "Langue :",
      resume: {
        title: "Curriculum Vitae (CV)",
        filename: "CV_Fahed_Mbarek.pdf",
        url: "/Resumes/FR/CV_Fahed_Mbarek.pdf",
        desc: "Ingénieur Logiciel Full-Stack • Systèmes Distribués, IA & Web Moderne",
        badge: "PDF • FORMAT ATS • 2026",
      },
      letter: {
        title: "Lettre de Motivation",
        filename: "Lettre_Motivation_Fahed_Mbarek.pdf",
        url: "/Resumes/FR/Lettre_Motivation_Fahed_Mbarek.pdf",
        desc: "Lettre de Motivation Professionnelle • Ingénierie Logicielle & IA",
        badge: "PDF • OFFICIEL • 2026",
      },
      downloadBtn: "Télécharger PDF",
      viewBtn: "Ouvrir l'aperçu",
      closeBtn: "Fermer",
    },
  };

  const current = docs[lang];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in">
      {/* Dark Blur Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer transition-opacity duration-300"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0d0d11] border border-white/15 p-5 sm:p-7 shadow-2xl text-white z-10 animate-section-entrance overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] sm:text-xs font-mono font-bold mb-2">
              <FileText className="w-3 h-3 text-yellow-400" />
              <span>CANDIDACY ASSETS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
              {current.title}
            </h2>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              {current.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title={current.closeBtn}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Switcher Tabs */}
        <div className="flex items-center justify-between gap-3 mb-5 p-2 rounded-2xl bg-neutral-900/90 border border-white/10">
          <span className="text-xs font-mono text-neutral-400 pl-2 hidden sm:inline">
            {current.langLabel}
          </span>
          <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setLang("ENG")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                lang === "ENG"
                  ? "bg-[#FFD600] text-black shadow-md shadow-yellow-500/20 font-black"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🇬🇧 ENGLISH</span>
              {lang === "ENG" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            <button
              onClick={() => setLang("FR")}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                lang === "FR"
                  ? "bg-[#FFD600] text-black shadow-md shadow-yellow-500/20 font-black"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>🇫🇷 FRANÇAIS</span>
              {lang === "FR" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="space-y-3.5 mb-5">
          {/* Card 1: Resume / CV */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-yellow-400/40 transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    {current.resume.badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold font-display text-white">
                  {current.resume.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  {current.resume.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={current.resume.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  title={current.viewBtn}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{current.viewBtn}</span>
                </a>

                <a
                  href={current.resume.url}
                  download={current.resume.filename}
                  className="px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black text-xs font-mono font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{current.downloadBtn}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Motivation Letter */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 hover:border-yellow-400/40 transition-all group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-yellow-500/15 border border-yellow-500/30 text-yellow-300">
                    {current.letter.badge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold font-display text-white">
                  {current.letter.title}
                </h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">
                  {current.letter.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={current.letter.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  title={current.viewBtn}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{current.viewBtn}</span>
                </a>

                <a
                  href={current.letter.url}
                  download={current.letter.filename}
                  className="px-4 py-2 rounded-xl bg-[#FFD600] hover:bg-[#FFE033] text-black text-xs font-mono font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{current.downloadBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & close */}
        <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-neutral-500">
          <span>Fahed Mbarek • Software Engineer</span>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {current.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
