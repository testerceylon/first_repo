"use client";

import { useState } from "react";

interface KDTier {
  min: number;
  max: number;
  label: string;
  tier: string;
  color: string;
  topPercent: string;
}

const TIERS: KDTier[] = [
  { min: 3.0, max: Infinity, label: "Elite Player 🔥", tier: "Elite", color: "#ffd700", topPercent: "Top 1%" },
  { min: 2.0, max: 3.0, label: "Pro Player", tier: "Pro", color: "#aaff00", topPercent: "Top 10%" },
  { min: 1.2, max: 2.0, label: "Good Player", tier: "Good", color: "#ffcc00", topPercent: "Top 30%" },
  { min: 0.8, max: 1.2, label: "Average", tier: "Average", color: "#a0a0a0", topPercent: "Most Players" },
  { min: 0, max: 0.8, label: "Keep Practicing", tier: "Improving", color: "#ff2d2d", topPercent: "Keep Grinding" },
];

function getTier(kd: number): KDTier {
  return TIERS.find((t) => kd >= t.min && kd < t.max) ?? TIERS[TIERS.length - 1];
}

function calcKD(kills: number, deaths: number): number {
  if (deaths <= 0) return kills;
  return Math.round((kills / deaths) * 100) / 100;
}

interface Session {
  kills: string;
  deaths: string;
}

export function KDCalculator() {
  const [kills, setKills] = useState("");
  const [deaths, setDeaths] = useState("");
  const [sessions, setSessions] = useState<Session[]>([{ kills: "", deaths: "" }]);

  const k = parseFloat(kills);
  const d = parseFloat(deaths);
  const validMainKD = !isNaN(k) && !isNaN(d) && k >= 0 && d >= 1;
  const mainKD = validMainKD ? calcKD(k, d) : null;
  const mainTier = mainKD !== null ? getTier(mainKD) : null;

  const validSessions = sessions.filter((s) => {
    const sk = parseFloat(s.kills);
    const sd = parseFloat(s.deaths);
    return !isNaN(sk) && !isNaN(sd) && sk >= 0 && sd >= 1;
  });
  const totalKills = validSessions.reduce((acc, s) => acc + parseFloat(s.kills), 0);
  const totalDeaths = validSessions.reduce((acc, s) => acc + parseFloat(s.deaths), 0);
  const overallKD = totalDeaths > 0 ? calcKD(totalKills, totalDeaths) : null;

  const inputClass = "bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 font-body text-white text-sm w-full focus:outline-none focus:border-[#aaff00] transition-colors";

  return (
    <div className="w-full space-y-6">
      {/* Main calculator */}
      <div className="card-gaming p-6">
        <h3 className="font-heading font-bold text-white uppercase mb-5">K/D Calculator</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-body text-xs text-[#555] uppercase tracking-wider mb-1 block">Total Kills</label>
            <input
              type="number"
              min={0}
              value={kills}
              onChange={(e) => setKills(e.target.value)}
              className={inputClass}
              placeholder="e.g. 1500"
            />
          </div>
          <div>
            <label className="font-body text-xs text-[#555] uppercase tracking-wider mb-1 block">Total Deaths</label>
            <input
              type="number"
              min={1}
              value={deaths}
              onChange={(e) => setDeaths(e.target.value)}
              className={inputClass}
              placeholder="e.g. 800"
            />
          </div>
        </div>

        {mainKD !== null && mainTier ? (
          <div className="text-center py-4">
            <p className="font-body text-[#a0a0a0] text-sm mb-2">Your K/D Ratio</p>
            <p
              className="font-heading font-bold text-7xl mb-3 transition-all"
              style={{ color: mainTier.color, textShadow: `0 0 40px ${mainTier.color}55` }}
            >
              {mainKD.toFixed(2)}
            </p>
            <p className="font-heading text-lg font-bold" style={{ color: mainTier.color }}>
              {mainTier.label}
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-[#333] font-body text-sm">
            Enter kills and deaths above
          </div>
        )}
      </div>

      {/* Session tracker */}
      <div className="card-gaming p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-white uppercase">Session Tracker</h3>
          <button
            onClick={() => setSessions([{ kills: "", deaths: "" }])}
            className="font-body text-xs text-[#555] hover:text-[#ff2d2d] transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {sessions.map((s, i) => {
            const sk = parseFloat(s.kills);
            const sd = parseFloat(s.deaths);
            const sessionKD = !isNaN(sk) && !isNaN(sd) && sd >= 1 ? calcKD(sk, sd) : null;
            return (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  value={s.kills}
                  onChange={(e) => setSessions((prev) => prev.map((ss, j) => j === i ? { ...ss, kills: e.target.value } : ss))}
                  className={inputClass}
                  placeholder="Kills"
                />
                <input
                  type="number"
                  min={1}
                  value={s.deaths}
                  onChange={(e) => setSessions((prev) => prev.map((ss, j) => j === i ? { ...ss, deaths: e.target.value } : ss))}
                  className={inputClass}
                  placeholder="Deaths"
                />
                <span
                  className="font-heading font-bold text-sm w-12 text-center"
                  style={{ color: sessionKD !== null ? getTier(sessionKD).color : "#333" }}
                >
                  {sessionKD !== null ? sessionKD.toFixed(2) : "—"}
                </span>
                <button
                  onClick={() => setSessions((prev) => prev.filter((_, j) => j !== i))}
                  className="text-[#333] hover:text-[#ff2d2d] transition-colors font-body text-lg leading-none"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {sessions.length < 10 && (
          <button
            onClick={() => setSessions((p) => [...p, { kills: "", deaths: "" }])}
            className="font-body text-sm text-[#aaff00] hover:underline mb-4 block"
          >
            + Add Session
          </button>
        )}

        {overallKD !== null && (
          <div className="border-t border-[#1a1a1a] pt-4 flex items-center justify-between">
            <div className="font-body text-sm text-[#a0a0a0]">
              {totalKills} kills / {totalDeaths} deaths (overall)
            </div>
            <div>
              <span className="font-body text-xs text-[#555] mr-2">Overall K/D</span>
              <span
                className="font-heading font-bold text-2xl"
                style={{ color: getTier(overallKD).color }}
              >
                {overallKD.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Benchmark table */}
      <div className="card-gaming p-6">
        <h3 className="font-heading font-bold text-white uppercase mb-5">KD Benchmark</h3>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left py-2 text-[#555] font-normal uppercase text-xs tracking-wider">KD Range</th>
                <th className="text-left py-2 text-[#555] font-normal uppercase text-xs tracking-wider">Tier</th>
                <th className="text-left py-2 text-[#555] font-normal uppercase text-xs tracking-wider">% of Players</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {TIERS.map((t) => {
                const isActive = mainKD !== null && mainKD >= t.min && mainKD < t.max;
                return (
                  <tr
                    key={t.tier}
                    className={`transition-colors ${isActive ? "bg-[#aaff00]/5" : ""}`}
                  >
                    <td className={`py-3 ${isActive ? "font-bold" : ""}`} style={{ color: isActive ? t.color : "#a0a0a0" }}>
                      {t.min === 3 ? "3.0+" : t.max === Infinity ? `${t.min}+` : `${t.min}–${t.max}`}
                      {isActive && <span className="ml-2 text-xs border rounded px-1" style={{ borderColor: t.color, color: t.color }}>You</span>}
                    </td>
                    <td className="py-3" style={{ color: isActive ? t.color : "#a0a0a0" }}>{t.tier}</td>
                    <td className="py-3 text-[#555]">{t.topPercent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
