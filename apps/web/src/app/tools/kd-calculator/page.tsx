import type { Metadata } from "next";
import { KDCalculator } from "@/components/tools/kd-calculator";

export const metadata: Metadata = {
  title: "CoD Mobile K/D Ratio Calculator",
  description:
    "Calculate your Call of Duty Mobile Kill/Death ratio, track multiple sessions, and see how you rank against other players. Free online CODM KD calculator.",
};

export default function KDPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <span className="badge mb-3 inline-block">Free Tool</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase mb-3">
            K/D <span className="neon-text">Calculator</span>
          </h1>
          <p className="font-body text-[#a0a0a0] max-w-xl">
            Calculate your Kill/Death ratio, track multiple sessions, and see where you rank against other CoD Mobile players.
          </p>
        </div>

        <KDCalculator />

        {/* Adsense slot */}
        {/* ADSENSE_AD_SLOT: KD_TOOL */}
        <div id="adsense-kd" className="my-8" style={{ minHeight: 250 }}>
          {/* Insert Adsense ad unit code here */}
        </div>

        {/* SEO content */}
        <div className="card-gaming p-8 prose-gaming max-w-none">
          <h2 className="font-heading font-bold text-white text-2xl uppercase mb-4">
            What is a Good K/D Ratio in CoD Mobile?
          </h2>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            Your Kill/Death ratio (K/D) in CoD Mobile is the total number of kills divided by your total deaths. It&apos;s
            the most common way players measure individual performance across matches. A K/D of 1.0 means you earn exactly
            one kill for every death — you&apos;re breaking even. Most casual players sit between 0.8 and 1.5.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            A K/D above 2.0 is considered very strong — only around the top 10% of active players achieve this
            consistently. Elite players with 3.0+ K/D ratios represent roughly the top 1% of the playerbase. These
            numbers vary by game mode: Battle Royale typically produces lower K/Ds than Multiplayer due to the larger
            player count and longer matches.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            To improve your K/D, focus on positioning over aggression. Don&apos;t rush into fights you can&apos;t win.
            Use the sensitivity calculator to optimise your aim speed, build a loadout suited to your playstyle, and
            practise in training mode to build muscle memory before ranked matches.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed">
            Keywords: CoD Mobile KD ratio, good KD CODM, how to improve KD Call of Duty Mobile,
            KD calculator CODM 2025, average KD Call of Duty Mobile.
          </p>
        </div>
      </div>
    </main>
  );
}
