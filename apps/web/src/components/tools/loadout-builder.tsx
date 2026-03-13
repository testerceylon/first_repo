"use client";

import { useState } from "react";
import weaponData from "@/data/codm-weapons.json";

type WeaponType = "All" | "Assault Rifle" | "SMG" | "Sniper" | "Shotgun" | "LMG";
const WEAPON_TYPES: WeaponType[] = ["All", "Assault Rifle", "SMG", "Sniper", "Shotgun", "LMG"];
const MAX_ATTACHMENTS = 5;

interface Attachments {
  [slot: string]: string;
}

interface Loadout {
  weaponId: string;
  attachments: Attachments;
  perk1: string;
  perk2: string;
  perk3: string;
  lethal: string;
  tactical: string;
}

const emptyLoadout: Loadout = {
  weaponId: "",
  attachments: {},
  perk1: "",
  perk2: "",
  perk3: "",
  lethal: "",
  tactical: "",
};

function countActiveAttachments(attachments: Attachments): number {
  return Object.values(attachments).filter((v) => v && v !== "No Attachment").length;
}

function buildShareText(loadout: Loadout): string {
  const weapon = weaponData.weapons.find((w) => w.id === loadout.weaponId);
  const lines = [
    "🎮 My Inicio Official Loadout",
    "───────────────────────────",
    `Primary: ${weapon?.name ?? "None"}`,
    "Attachments:",
    ...weaponData.attachmentSlots.map((slot) => {
      const val = loadout.attachments[slot] ?? "No Attachment";
      return val !== "No Attachment" ? `  - ${slot}: ${val}` : null;
    }).filter(Boolean),
    "",
    `Perks: ${loadout.perk1 || "–"} | ${loadout.perk2 || "–"} | ${loadout.perk3 || "–"}`,
    `Lethal: ${loadout.lethal || "–"} | Tactical: ${loadout.tactical || "–"}`,
    "",
    "Build yours → inicioofficial.com/tools/loadout",
  ];
  return lines.join("\n");
}

export function LoadoutBuilder() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [filterType, setFilterType] = useState<WeaponType>("All");
  const [loadout, setLoadout] = useState<Loadout>(emptyLoadout);
  const [copied, setCopied] = useState(false);

  const filteredWeapons = weaponData.weapons.filter(
    (w) => filterType === "All" || w.type === filterType
  );

  const activeCount = countActiveAttachments(loadout.attachments);

  function selectWeapon(id: string) {
    setLoadout({ ...emptyLoadout, weaponId: id });
    setStep(2);
  }

  function setAttachment(slot: string, value: string) {
    const current = loadout.attachments[slot] ?? "No Attachment";
    const wasActive = current !== "No Attachment";
    const willBeActive = value !== "No Attachment";
    if (!wasActive && willBeActive && activeCount >= MAX_ATTACHMENTS) return;
    setLoadout((p) => ({ ...p, attachments: { ...p.attachments, [slot]: value } }));
  }

  function handleCopy() {
    const text = buildShareText(loadout);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(buildShareText(loadout));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  const selectedWeapon = weaponData.weapons.find((w) => w.id === loadout.weaponId);

  function selectClass() {
    return "w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 font-body text-white text-sm focus:outline-none focus:border-[#aaff00] transition-colors";
  }

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {[
          { n: 1, label: "Weapon" },
          { n: 2, label: "Attachments" },
          { n: 3, label: "Perks & Equipment" },
        ].map(({ n, label }) => (
          <button
            key={n}
            onClick={() => loadout.weaponId ? setStep(n as 1 | 2 | 3) : undefined}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-heading text-sm uppercase transition-all ${
              step === n
                ? "bg-[#aaff00] text-black font-bold"
                : "border border-[#2a2a2a] text-[#555]"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === n ? "bg-black text-[#aaff00]" : "bg-[#222] text-[#555]"}`}>{n}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main panel */}
        <div className="lg:col-span-2">
          {/* Step 1 — Weapon */}
          {step === 1 && (
            <div className="card-gaming p-6">
              <h3 className="font-heading font-bold text-white uppercase mb-4">Choose Primary Weapon</h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {WEAPON_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`font-body text-sm px-3 py-1.5 rounded-full transition-all ${
                      filterType === t
                        ? "bg-[#aaff00] text-black font-bold"
                        : "border border-[#2a2a2a] text-[#a0a0a0] hover:border-[#aaff00]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredWeapons.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => selectWeapon(w.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      loadout.weaponId === w.id
                        ? "border-[#aaff00] bg-[#aaff00]/10"
                        : "border-[#2a2a2a] bg-[#111] hover:border-[#aaff00]/50"
                    }`}
                  >
                    <p className="font-heading font-bold text-white text-sm">{w.name}</p>
                    <p className="font-body text-[#555] text-xs">{w.type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Attachments */}
          {step === 2 && (
            <div className="card-gaming p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-white uppercase">Attachments</h3>
                <span className={`font-body text-sm px-3 py-1 rounded-full ${activeCount >= MAX_ATTACHMENTS ? "bg-[#ff2d2d]/20 text-[#ff2d2d]" : "bg-[#aaff00]/10 text-[#aaff00]"}`}>
                  {activeCount}/{MAX_ATTACHMENTS}
                </span>
              </div>
              {activeCount >= MAX_ATTACHMENTS && (
                <p className="font-body text-xs text-[#ff2d2d] mb-4">Max 5 attachments reached. Remove one to swap.</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {weaponData.attachmentSlots.map((slot) => {
                  const options = (weaponData.attachments as Record<string, string[]>)[slot] ?? [];
                  const current = loadout.attachments[slot] ?? "No Attachment";
                  const isActive = current !== "No Attachment";
                  return (
                    <div key={slot}>
                      <label className={`font-body text-xs uppercase tracking-wider mb-1 block ${isActive ? "text-[#aaff00]" : "text-[#555]"}`}>
                        {slot}
                      </label>
                      <select
                        value={current}
                        onChange={(e) => setAttachment(slot, e.target.value)}
                        className={selectClass()}
                      >
                        {options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setStep(3)}
                className="mt-6 btn-neon w-full font-heading uppercase"
              >
                Next: Perks & Equipment →
              </button>
            </div>
          )}

          {/* Step 3 — Perks & Equipment */}
          {step === 3 && (
            <div className="card-gaming p-6">
              <h3 className="font-heading font-bold text-white uppercase mb-5">Perks & Equipment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {weaponData.perks.map((p, i) => {
                  const key = `perk${p.slot}` as "perk1" | "perk2" | "perk3";
                  return (
                    <div key={i}>
                      <label className="font-body text-xs uppercase tracking-wider text-[#555] mb-1 block">Perk {p.slot}</label>
                      <select
                        value={(loadout[key] as string) || ""}
                        onChange={(e) => setLoadout((prev) => ({ ...prev, [key]: e.target.value }))}
                        className={selectClass()}
                      >
                        <option value="">– Select –</option>
                        {p.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-[#555] mb-1 block">Lethal</label>
                  <select
                    value={loadout.lethal}
                    onChange={(e) => setLoadout((p) => ({ ...p, lethal: e.target.value }))}
                    className={selectClass()}
                  >
                    <option value="">– Select –</option>
                    {weaponData.equipment.lethal.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-[#555] mb-1 block">Tactical</label>
                  <select
                    value={loadout.tactical}
                    onChange={(e) => setLoadout((p) => ({ ...p, tactical: e.target.value }))}
                    className={selectClass()}
                  >
                    <option value="">– Select –</option>
                    {weaponData.equipment.tactical.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="card-gaming p-6 flex flex-col gap-4 h-fit sticky top-20">
          <h3 className="font-heading font-bold text-white uppercase text-sm">Live Loadout</h3>

          <div>
            <p className="font-body text-xs text-[#555] uppercase tracking-wider mb-1">Weapon</p>
            <p className="font-heading font-bold text-[#aaff00]">
              {selectedWeapon?.name ?? <span className="text-[#333]">Not selected</span>}
            </p>
          </div>

          {weaponData.attachmentSlots.some((s) => loadout.attachments[s] && loadout.attachments[s] !== "No Attachment") && (
            <div>
              <p className="font-body text-xs text-[#555] uppercase tracking-wider mb-1">Attachments ({activeCount}/5)</p>
              <ul className="space-y-0.5">
                {weaponData.attachmentSlots.map((slot) => {
                  const val = loadout.attachments[slot];
                  if (!val || val === "No Attachment") return null;
                  return (
                    <li key={slot} className="font-body text-xs text-white">
                      <span className="text-[#555]">{slot}: </span>{val}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {(loadout.perk1 || loadout.perk2 || loadout.perk3) && (
            <div>
              <p className="font-body text-xs text-[#555] uppercase tracking-wider mb-1">Perks</p>
              <p className="font-body text-xs text-white">
                {[loadout.perk1, loadout.perk2, loadout.perk3].filter(Boolean).join(" | ")}
              </p>
            </div>
          )}

          {(loadout.lethal || loadout.tactical) && (
            <div>
              <p className="font-body text-xs text-[#555] uppercase tracking-wider mb-1">Equipment</p>
              <p className="font-body text-xs text-white">
                {[loadout.lethal, loadout.tactical].filter(Boolean).join(" | ")}
              </p>
            </div>
          )}

          <div className="border-t border-[#1a1a1a] pt-4 flex flex-col gap-2 mt-auto">
            <button
              onClick={handleCopy}
              disabled={!loadout.weaponId}
              className="btn-neon w-full font-heading uppercase text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {copied ? "Copied! ✓" : "Copy Loadout"}
            </button>
            <button
              onClick={handleWhatsApp}
              disabled={!loadout.weaponId}
              className="w-full px-4 py-2 rounded-lg bg-[#25d366] text-white font-heading text-sm uppercase hover:bg-[#20b858] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Share on WhatsApp
            </button>
            <button
              onClick={() => { setLoadout(emptyLoadout); setStep(1); }}
              className="w-full px-4 py-2 rounded-lg border border-[#2a2a2a] text-[#555] font-body text-sm hover:text-[#ff2d2d] hover:border-[#ff2d2d] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
