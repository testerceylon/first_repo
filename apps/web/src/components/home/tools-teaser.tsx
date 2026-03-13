import Link from "next/link";
import { Crosshair, Layers, TrendingUp, ArrowRight } from "lucide-react";

const TOOLS = [
  {
    icon: Crosshair,
    title: "Sensitivity Calculator",
    description: "Convert your sensitivity across devices and find the perfect settings for CoD Mobile.",
    href: "/tools/sensitivity",
    color: "#aaff00",
  },
  {
    icon: Layers,
    title: "Loadout Builder",
    description: "Build and share optimized weapon loadouts with attachment synergy scores.",
    href: "/tools/loadout",
    color: "#ff2d2d",
  },
  {
    icon: TrendingUp,
    title: "K/D Calculator",
    description: "Track your Kill/Death ratio and visualize performance trends over time.",
    href: "/tools/kd-calculator",
    color: "#00aaff",
  },
];

export function ToolsTeaser() {
  return (
    <section className="py-20 px-4 bg-[#0d0d0d] border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#aaff00] text-xs font-bold uppercase tracking-widest mb-2">Gaming Tools</p>
            <h2 className="text-4xl font-bold font-[Rajdhani] leading-none">
              LEVEL UP YOUR GAME
            </h2>
          </div>
          <Link
            href="/tools"
            className="hidden md:flex items-center gap-2 text-[#a0a0a0] hover:text-[#aaff00] transition-colors text-sm font-semibold group"
          >
            See All Tools
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-[#111] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#2a2a2a] transition-all duration-300 overflow-hidden"
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${tool.color}, transparent 60%)` }}
                />

                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: tool.color }} />
                </div>

                <h3 className="text-lg font-bold font-[Rajdhani] mb-2 group-hover:text-white transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>

                <span
                  className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: tool.color }}
                >
                  Open Tool <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/tools" className="inline-flex items-center gap-2 text-[#a0a0a0] hover:text-[#aaff00] transition-colors text-sm font-semibold">
            See All Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
