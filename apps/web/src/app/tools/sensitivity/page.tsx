import type { Metadata } from "next";
import { SensitivityCalculator } from "@/components/tools/sensitivity-calculator";

export const metadata: Metadata = {
  title: "CoD Mobile Sensitivity Calculator",
  description:
    "Convert your Call of Duty Mobile sensitivity settings between devices. Free online CODM sensitivity converter — transfer your muscle memory across phones and tablets.",
};

export default function SensitivityPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <span className="badge mb-3 inline-block">Free Tool</span>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white uppercase mb-3">
            Sensitivity <span className="neon-text">Calculator</span>
          </h1>
          <p className="font-body text-[#a0a0a0] max-w-xl">
            Convert your CoD Mobile sensitivity between devices so your muscle memory transfers perfectly.
          </p>
        </div>

        <SensitivityCalculator />

        {/* Adsense slot */}
        {/* ADSENSE_AD_SLOT: SENSITIVITY_TOOL */}
        <div id="adsense-sensitivity" className="my-8" style={{ minHeight: 90 }}>
          {/* Insert Adsense ad unit code here */}
        </div>

        {/* SEO content */}
        <div className="card-gaming p-8 prose-gaming max-w-none">
          <h2 className="font-heading font-bold text-white text-2xl uppercase mb-4">
            How to Use the CoD Mobile Sensitivity Calculator
          </h2>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            When you switch phones or upgrade to a new device, your old CoD Mobile sensitivity feels completely wrong.
            That&apos;s because sensitivity in CoD Mobile is an abstract number — its real-world effect depends on your
            device&apos;s DPI, screen size, and resolution. A sensitivity of 100 on a 6.1&quot; 1080p phone produces a
            very different aim speed than 100 on a 10.9&quot; tablet.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            This calculator uses your device&apos;s effective DPI (eDPI = DPI × pixels per inch) to find a mathematically
            equivalent sensitivity on your target device. The goal is to keep the same <em>physical distance your thumb
            needs to move</em> for a 360° rotation — preserving your aim muscle memory.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed mb-4">
            To get the most accurate result, fill in the DPI and screen size for both devices. If you&apos;re not sure of
            your DPI, 800 is a safe default for most Android phones. Use the quick preset buttons to auto-fill values for
            popular devices like the Samsung S24, iPhone 15, or budget Android phones.
          </p>
          <p className="font-body text-[#a0a0a0] leading-relaxed">
            Keywords: CoD Mobile sensitivity, CODM sensitivity converter, best sensitivity CoD Mobile 2025,
            convert sensitivity between devices Call of Duty Mobile.
          </p>
        </div>
      </div>
    </main>
  );
}
