"use client";

import { useState } from "react";

const RESOLUTION_WIDTH: Record<string, number> = {
  "1080p": 1920,
  "720p": 1280,
  "480p": 854,
};

const RESOLUTIONS = ["1080p", "720p", "480p"] as const;
const GAME_MODES = ["Battle Royale", "Multiplayer"] as const;

const PRESETS = [
  { name: "Samsung S24 Ultra", screenInches: 6.9, resolution: "1080p", dpi: 800 },
  { name: "Samsung S24", screenInches: 6.2, resolution: "1080p", dpi: 800 },
  { name: "iPad 10th Gen", screenInches: 10.9, resolution: "1080p", dpi: 800 },
  { name: "Budget Android", screenInches: 6.5, resolution: "720p", dpi: 800 },
  { name: "iPhone 15", screenInches: 6.1, resolution: "1080p", dpi: 800 },
  { name: "Redmi Note 13", screenInches: 6.67, resolution: "1080p", dpi: 800 },
] as const;

interface DeviceConfig {
  sensitivity: string;
  dpi: string;
  screenInches: string;
  resolution: string;
}

function calcEffectiveDPI(dpi: number, resWidth: number, screenInches: number): number {
  return dpi * (resWidth / screenInches);
}

export function SensitivityCalculator() {
  const [gameMode, setGameMode] = useState<string>("Battle Royale");
  const [source, setSource] = useState<DeviceConfig>({
    sensitivity: "100",
    dpi: "800",
    screenInches: "",
    resolution: "1080p",
  });
  const [target, setTarget] = useState<DeviceConfig>({
    sensitivity: "",
    dpi: "800",
    screenInches: "",
    resolution: "1080p",
  });

  const sourceDPI = parseFloat(source.dpi);
  const targetDPI = parseFloat(target.dpi);
  const sourceInches = parseFloat(source.screenInches);
  const targetInches = parseFloat(target.screenInches);
  const sourceSens = parseFloat(source.sensitivity);
  const sourceResW = RESOLUTION_WIDTH[source.resolution] ?? 1920;
  const targetResW = RESOLUTION_WIDTH[target.resolution] ?? 1920;

  let result: number | null = null;
  let effectiveSrc: number | null = null;
  let effectiveTgt: number | null = null;
  let scaleFactor: number | null = null;

  if (!isNaN(sourceSens) && sourceSens >= 1) {
    let sf = 1;
    if (!isNaN(sourceDPI) && !isNaN(targetDPI) && !isNaN(sourceInches) && !isNaN(targetInches) &&
      sourceInches > 0 && targetInches > 0 && sourceDPI > 0 && targetDPI > 0) {
      effectiveSrc = calcEffectiveDPI(sourceDPI, sourceResW, sourceInches);
      effectiveTgt = calcEffectiveDPI(targetDPI, targetResW, targetInches);
      sf = effectiveSrc / effectiveTgt;
    }
    scaleFactor = sf;
    result = Math.max(1, Math.min(200, Math.round(sourceSens * sf)));
  }

  function applyPresetTo(side: "source" | "target", preset: (typeof PRESETS)[number]) {
    const update = {
      dpi: String(preset.dpi),
      screenInches: String(preset.screenInches),
      resolution: preset.resolution,
    };
    if (side === "source") setSource((p) => ({ ...p, ...update }));
    else setTarget((p) => ({ ...p, ...update }));
  }

  function inputClass() {
    return "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 font-body text-white text-sm focus:outline-none focus:border-[#aaff00] transition-colors";
  }

  function selectClass() {
    return "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 font-body text-white text-sm focus:outline-none focus:border-[#aaff00] transition-colors";
  }

  function DevicePanel({ side, cfg, setCfg }: {
    side: "source" | "target";
    cfg: DeviceConfig;
    setCfg: React.Dispatch<React.SetStateAction<DeviceConfig>>;
  }) {
    const label = side === "source" ? "Source Device" : "Target Device";
    return (
      <div className="card-gaming p-6 flex flex-col gap-5">
        <h3 className="font-heading font-bold text-white uppercase tracking-wider text-sm">
          {label}
        </h3>

        {/* Presets */}
        <div>
          <p className="font-body text-[#555] text-xs mb-2 uppercase tracking-wider">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPresetTo(side, p)}
                className="text-xs px-2 py-1 rounded border border-[#2a2a2a] text-[#a0a0a0] hover:border-[#aaff00] hover:text-[#aaff00] transition-colors font-body"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {side === "source" && (
          <div>
            <label className="font-body text-xs text-[#555] uppercase tracking-wider mb-1 block">Sensitivity (1–200)</label>
            <input
              type="number"
              min={1}
              max={200}
              value={cfg.sensitivity}
              onChange={(e) => setCfg((p) => ({ ...p, sensitivity: e.target.value }))}
              className={inputClass()}
              placeholder="e.g. 100"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-[#555] uppercase tracking-wider mb-1 block">DPI</label>
            <input
              type="number"
              min={100}
              value={cfg.dpi}
              onChange={(e) => setCfg((p) => ({ ...p, dpi: e.target.value }))}
              className={inputClass()}
              placeholder="800"
            />
          </div>
          <div>
            <label className="font-body text-xs text-[#555] uppercase tracking-wider mb-1 block">Screen Size (in)</label>
            <input
              type="number"
              step="0.1"
              min={4}
              max={15}
              value={cfg.screenInches}
              onChange={(e) => setCfg((p) => ({ ...p, screenInches: e.target.value }))}
              className={inputClass()}
              placeholder="6.5"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-xs text-[#555] uppercase tracking-wider mb-1 block">Resolution</label>
          <select
            value={cfg.resolution}
            onChange={(e) => setCfg((p) => ({ ...p, resolution: e.target.value }))}
            className={selectClass()}
          >
            {RESOLUTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Game mode */}
      <div className="flex gap-2 mb-6">
        {GAME_MODES.map((m) => (
          <button
            key={m}
            onClick={() => setGameMode(m)}
            className={`font-heading text-sm px-4 py-2 rounded-lg uppercase transition-all ${
              gameMode === m
                ? "bg-[#aaff00] text-black font-bold"
                : "border border-[#2a2a2a] text-[#a0a0a0] hover:border-[#aaff00]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DevicePanel side="source" cfg={source} setCfg={setSource} />
        <DevicePanel side="target" cfg={target} setCfg={setTarget} />
      </div>

      {/* Result */}
      <div className={`card-gaming p-8 text-center mb-6 ${result !== null ? "border-[#aaff00]/30" : ""}`}>
        {result !== null ? (
          <>
            <p className="font-body text-[#a0a0a0] text-sm mb-2">Your converted sensitivity</p>
            <p className="font-heading font-bold text-7xl text-[#aaff00] mb-4" style={{ textShadow: "0 0 40px rgba(170,255,0,0.4)" }}>
              {result}
            </p>
            {scaleFactor !== null && effectiveSrc !== null && effectiveTgt !== null && (
              <div className="mt-6 text-left inline-block w-full max-w-sm mx-auto">
                <table className="w-full font-body text-sm">
                  <tbody className="divide-y divide-[#1a1a1a]">
                    <tr>
                      <td className="py-2 text-[#555]">Source eDPI</td>
                      <td className="py-2 text-white text-right">{effectiveSrc.toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#555]">Target eDPI</td>
                      <td className="py-2 text-white text-right">{effectiveTgt.toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#555]">Scale Factor</td>
                      <td className="py-2 text-white text-right">{scaleFactor.toFixed(4)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#aaff00] font-bold">Result</td>
                      <td className="py-2 text-[#aaff00] font-bold text-right">{result}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {scaleFactor === 1 && (
              <p className="font-body text-[#555] text-xs mt-2">Fill in screen size & DPI on both sides for a precise conversion</p>
            )}
          </>
        ) : (
          <p className="font-body text-[#555]">Enter a source sensitivity above to see your result</p>
        )}
      </div>
    </div>
  );
}
