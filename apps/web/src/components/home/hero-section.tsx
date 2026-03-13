"use client";

import Link from "next/link";
import { Youtube } from "lucide-react";

const YOUTUBE_URL = "https://www.youtube.com/@inicioofficial";
const DISCORD_URL = "https://discord.gg/5QxDveWj85";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* Animated grid background */}
      <div className="absolute inset-0 hero-grid opacity-60" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#aaff00]/8 via-transparent to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(170,255,0,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center">
        {/* YouTube badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] mb-8">
          <Youtube className="w-4 h-4 text-[#ff0000]" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#aaff00]">
            55K+ Subscribers
          </span>
          {/* TODO: Can fetch live count from YouTube API stats endpoint */}
        </div>

        {/* Main headline */}
        <h1 className="font-heading font-bold uppercase leading-none mb-6">
          <span
            className="block text-white"
            style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)", letterSpacing: "0.04em" }}
          >
            DOMINATE THE
          </span>
          <span
            className="block neon-text"
            style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)", letterSpacing: "0.04em" }}
          >
            BATTLEFIELD
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-body text-[#a0a0a0] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          CoD Mobile guides, news &amp; community — from Inicio Official
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-youtube w-full sm:w-auto"
            style={{ padding: "0.875rem 2rem", fontSize: "0.875rem" }}
          >
            <Youtube className="w-4 h-4" />
            WATCH LATEST VIDEO
          </a>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline w-full sm:w-auto"
            style={{ padding: "0.875rem 2rem", fontSize: "0.875rem" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.014.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            JOIN DISCORD
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-[#aaff00] to-transparent" />
          <span className="text-xs font-heading uppercase tracking-widest text-[#666]">Scroll</span>
        </div>
      </div>
    </section>
  );
}
