import type { Metadata } from "next";
import { LoadoutBuilder } from "@/components/tools/loadout-builder";

export const metadata: Metadata = {
  title: "CoD Mobile Loadout Builder",
  description:
    "Build and share your best CoD Mobile weapon loadouts. Pick any gun, choose 5 attachments, set perks and equipment — then share with your squad.",
};

export default function LoadoutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <span className="badge mb-3 inline-block">Free Tool</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase mb-3">
            Loadout <span className="neon-text">Builder</span>
          </h1>
          <p className="font-body text-[#a0a0a0] max-w-xl">
            Build your perfect CoD Mobile weapon loadout and share it with your squad.
          </p>
        </div>

        <LoadoutBuilder />

        {/* Adsense slot */}
        {/* ADSENSE_AD_SLOT: LOADOUT_TOOL */}
        <div id="adsense-loadout" className="my-8" style={{ minHeight: 250 }}>
          {/* Insert Adsense ad unit code here */}
        </div>

        {/* SEO content */}
        <div className="card-gaming p-8 prose-gaming max-w-none">
          <h2 className="font-heading font-bold text-white text-2xl uppercase mb-4">
            How to Build the Best CoD Mobile Loadout
          </h2>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            A great CoD Mobile loadout starts with choosing the right weapon for your playstyle. Assault rifles like the
            AK-47 and Kilo 141 are versatile and work well at medium range. SMGs like the QQ9 and MP5 dominate close
            quarters. Snipers such as the DLQ33 reward patient, long-range play.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            Once you&apos;ve picked a weapon, focus on your 5 attachment slots strategically. A suppressor reduces your
            radar footprint. Extended mags keep you in fights longer. A grip tape or foregrip reduces recoil — critical
            for spray control. Think about what the attachment trades off (ads speed, mobility, stability) and prioritise
            around your playstyle.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            For perks, Ghost is the most valuable perk 2 choice — it hides you from UAVs. Pair it with Dead Silence
            (perk 3) for a pure stealth class, or Agile (perk 1) for faster ADS when sprinting. Amped in perk 3 is
            excellent for players who switch weapons often.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed">
            Keywords: best CoD Mobile loadout, CoD Mobile attachments guide, CODM weapon build 2025,
            best loadout Call of Duty Mobile, CoD Mobile class setup.
          </p>
        </div>
      </div>
    </main>
  );
}
