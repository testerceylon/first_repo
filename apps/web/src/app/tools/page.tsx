import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free CoD Mobile Gaming Tools",
  description:
    "Free Call of Duty Mobile tools — Sensitivity Calculator, Loadout Builder, KD Ratio Calculator. Improve your gameplay with Inicio Official.",
};

const tools = [
  {
    href: "/tools/sensitivity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      </svg>
    ),
    name: "Sensitivity Calculator",
    description:
      "Convert your CoD Mobile sensitivity settings between devices so your muscle memory transfers perfectly.",
    badge: "Most Popular",
  },
  {
    href: "/tools/loadout",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
        <path d="M3 7h4l2-3h6l2 3h4v12H3V7z" />
        <path d="M12 12v4M9 14h6" />
      </svg>
    ),
    name: "Loadout Builder",
    description:
      "Build and share your weapon loadouts. Pick your gun, choose 5 attachments, set perks & equipment.",
    badge: "Shareable",
  },
  {
    href: "/tools/kd-calculator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-5 4 3 4-6" />
      </svg>
    ),
    name: "K/D Calculator",
    description:
      "Calculate your Kill/Death ratio, track multiple sessions, and see where you rank against other players.",
    badge: "Track Progress",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 border-b border-[#1a1a1a]">
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="badge mb-4 inline-block">Free · No Login Required</span>
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-white uppercase mb-4">
            Gaming <span className="neon-text">Tools</span>
          </h1>
          <p className="font-body text-[#a0a0a0] text-lg max-w-xl mx-auto">
            Free CoD Mobile tools to analyse your gameplay, build the perfect loadout, and convert your sensitivity across devices.
          </p>
        </div>
      </section>

      {/* Tool cards */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="card-gaming p-8 flex flex-col gap-4 group">
              <div className="text-[#aaff00]">{tool.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-heading font-bold text-white text-xl uppercase">{tool.name}</h2>
                  <span className="badge text-[10px]">{tool.badge}</span>
                </div>
                <p className="font-body text-[#a0a0a0] text-sm leading-relaxed">{tool.description}</p>
              </div>
              <span className="font-heading text-sm text-[#aaff00] group-hover:gap-2 transition-all mt-auto flex items-center gap-1">
                Open Tool <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Adsense slot */}
      {/* ADSENSE_AD_SLOT: TOOLS_PAGE */}
      <div id="adsense-tools" className="mx-auto max-w-5xl px-4 pb-12" style={{ minHeight: 90 }}>
        {/* Insert Adsense ad unit code here */}
      </div>
    </main>
  );
}
