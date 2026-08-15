"use client";

import React, { useState } from "react";
import { Radio, Send, CheckCircle2, Globe, Share2, Mail, Sparkles } from "lucide-react";
import SpecularButton from "./SpecularButton";

export default function TransmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    frequency: "Project Collaboration",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "transmitting" | "sent">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("transmitting");

    // Simulate radio transmission dispatch
    setTimeout(() => {
      setStatus("sent");
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 glass-panel-dark text-white border border-white/10 shadow-2xl backdrop-blur-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-yellow-400">
            COSMIC RADIO TRANSMITTER // 1420.405 MHz
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>SATELLITE DISH LOCKED</span>
        </div>
      </div>

      {status === "sent" ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold font-display text-white">
            Transmission Broadcasted Successfully
          </h4>
          <p className="text-xs text-neutral-400 max-w-md font-mono">
            Your radio wave has been converted into a commit packet and dispatched into Fahed&apos;s personal inbox. Expect a telemetry response shortly.
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setFormData({ name: "", email: "", frequency: "Project Collaboration", message: "" });
            }}
            className="mt-4 px-5 py-2 rounded-full text-xs font-mono bg-white/10 hover:bg-white/20 text-neutral-300 transition-all cursor-pointer"
          >
            TRANSMIT ANOTHER SIGNAL
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
                CALLSIGN // YOUR NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Commander Sarah"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
                TRANSMISSION RETURN // EMAIL
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@orbital-station.com"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
              FREQUENCY // PURPOSE
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all"
            >
              <option value="Project Collaboration">New Project / High-Impact Collaboration</option>
              <option value="Full-Time Engineering">Engineering Role / Leadership Inquiry</option>
              <option value="Astronomy & Physics">Astronomy, Physics & Creative Coding</option>
              <option value="General Transmission">General Transmission / Say Hello</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
              PAYLOAD // MESSAGE
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Outline your project parameters, objectives, or idea..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:border-yellow-400/60 focus:outline-none transition-all placeholder:text-neutral-600 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>SIGNAL ENCRYPTION: 256-BIT DISPATCH</span>
            </div>
            <SpecularButton
              variant="yellow"
              type="submit"
              disabled={status === "transmitting"}
              className="w-full sm:w-auto"
            >
              {status === "transmitting" ? (
                <span>BROADCASTING...</span>
              ) : (
                <>
                  <span>TRANSMIT SIGNAL</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </SpecularButton>
          </div>
        </form>
      )}

      {/* Social Connection Orbit Pins */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400">
        <a
          href="mailto:fahed@example.com"
          className="hover:text-yellow-400 transition-colors flex items-center gap-1.5"
        >
          <Mail className="w-4 h-4 text-yellow-400" />
          <span>FAHED@EXAMPLE.COM</span>
        </a>
        <span className="text-neutral-700">•</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>GITHUB</span>
        </a>
        <span className="text-neutral-700">•</span>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Share2 className="w-4 h-4 text-indigo-400" />
          <span>LINKEDIN</span>
        </a>
      </div>
    </div>
  );
}
