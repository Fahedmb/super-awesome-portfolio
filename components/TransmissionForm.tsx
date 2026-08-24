"use client";

import React, { useState } from "react";
import {
  Radio,
  Send,
  CheckCircle2,
  Globe,
  Share2,
  Mail,
  Sparkles,
  FileDown,
  Phone,
  MapPin,
  Copy,
  Check,
  ArrowUp,
} from "lucide-react";
import SpecularButton from "./SpecularButton";

interface TransmissionFormProps {
  onNavigateToWorks?: () => void;
  onNavigateToOrigin?: () => void;
}

export default function TransmissionForm({ onNavigateToWorks, onNavigateToOrigin }: TransmissionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    frequency: "Full-Time Software Engineer / AI Role",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "transmitting" | "sent">("idle");
  const [copiedEmail, setCopiedEmail] = useState(false);

  React.useEffect(() => {
    const handleOrderEvent = (e: any) => {
      const detail = e.detail || {};
      setFormData((prev) => ({
        ...prev,
        frequency: detail.frequency || "Freelance Web Platform Delivery",
        message:
          detail.message ||
          "Hi Fahed, I would like to commission a custom interactive 3D portfolio / web platform for my personal branding. Let's discuss scope and timeline!",
      }));
    };

    window.addEventListener("order-portfolio-request", handleOrderEvent);
    return () => window.removeEventListener("order-portfolio-request", handleOrderEvent);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("fahedmbarek9@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("transmitting");

    // Dispatch simulation & prepare mailto fallback
    setTimeout(() => {
      setStatus("sent");
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl p-4 sm:p-8 glass-panel-dark text-white border border-white/10 shadow-2xl backdrop-blur-2xl max-h-[58vh] sm:max-h-[66vh] md:max-h-[72vh] overflow-y-auto">
      {/* Terminal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-yellow-400">
            TRANSMISSION TERMINAL // DIRECT DISPATCH
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>OPEN FOR ROLES &amp; PROJECTS</span>
        </div>
      </div>

      {status === "sent" ? (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-bold font-display text-white">
            Transmission Broadcasted
          </h4>
          <p className="text-xs text-neutral-300 max-w-md font-mono leading-relaxed">
            Message registered! You can also email directly at{" "}
            <strong className="text-yellow-400">fahedmbarek9@gmail.com</strong> or connect on LinkedIn.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setStatus("idle");
                setFormData({
                  name: "",
                  email: "",
                  frequency: "Full-Time Software Engineer / AI Role",
                  message: "",
                });
              }}
              className="px-4 py-2 rounded-full text-xs font-mono bg-white/10 hover:bg-white/20 text-neutral-300 transition-all cursor-pointer"
            >
              SEND ANOTHER MESSAGE
            </button>
            <a
              href="/Resume_Fahed_Mbarek.pdf"
              download="Resume_Fahed_Mbarek.pdf"
              className="px-4 py-2 rounded-full text-xs font-mono bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-all flex items-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>DOWNLOAD CV</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                YOUR NAME / ORGANIZATION
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Vance / Tech Corp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              PURPOSE / INQUIRY TYPE
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all"
            >
              <option value="Full-Time Software Engineer / AI Role">
                Full-Time Role — Software Engineer / AI Systems
              </option>
              <option value="Enterprise Systems & Microservices Architecture">
                Enterprise Project — Java / Spring Boot Microservices
              </option>
              <option value="Freelance Web Platform Delivery">
                Freelance Contracting — Custom Web Platform Delivery
              </option>
              <option value="AI Integration & Data Science">
                AI / LLM Integration & Data Science Engineering
              </option>
              <option value="General Transmission">General Inquiry / Say Hello</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              MESSAGE / PROJECT OUTLINE
            </label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell me about the role, project scope, or technical challenges..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all placeholder:text-neutral-600 resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <a
                href="/Resume_Fahed_Mbarek.pdf"
                download="Resume_Fahed_Mbarek.pdf"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 active:scale-95"
              >
                <FileDown className="w-3.5 h-3.5 text-yellow-400" />
                <span>DOWNLOAD CV (PDF)</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>

            <SpecularButton
              variant="yellow"
              type="submit"
              disabled={status === "transmitting"}
              className="w-full sm:w-auto !py-2.5 !px-5"
            >
              {status === "transmitting" ? (
                <span>SENDING MESSAGE...</span>
              ) : (
                <>
                  <span>SEND MESSAGE</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </SpecularButton>
          </div>
        </form>
      )}

      {/* Direct Contact Telemetry Pins */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono text-neutral-400">
        <a
          href="mailto:fahedmbarek9@gmail.com"
          className="hover:text-yellow-400 transition-colors flex items-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-yellow-400" />
          <span>fahedmbarek9@gmail.com</span>
        </a>
        <span className="text-neutral-700 hidden sm:inline">•</span>
        <a
          href="https://github.com/Fahedmb"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>github.com/Fahedmb</span>
        </a>
        <span className="text-neutral-700 hidden sm:inline">•</span>
        <a
          href="https://linkedin.com/in/fahed-mbarek"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>linkedin.com/in/fahed-mbarek</span>
        </a>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-mono text-neutral-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-amber-500" />
          <span>Tunisia, El Aouina (UTC+1)</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-amber-500" />
          <span>+216 20 731 135</span>
        </span>
      </div>
    </div>
  );
}
