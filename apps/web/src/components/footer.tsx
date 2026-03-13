"use client";

import Link from "next/link";
import { useState } from "react";
import { Youtube } from "lucide-react";
import { toast } from "sonner";

const YOUTUBE_URL = "https://www.youtube.com/@inicioofficial";
const DISCORD_URL = "https://discord.gg/5QxDveWj85";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029Va4Rpax4IBhCZSUEd01F";
const FACEBOOK_URL = "https://facebook.com/iniciofb";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast.success(data.message ?? "Subscribed!");
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#111111] border-t border-[#2a2a2a]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group mb-3">
              <span className="font-heading font-bold text-lg tracking-wider text-white group-hover:text-[#aaff00] transition-colors">
                INICIO <span className="text-[#aaff00]">OFFICIAL</span>
              </span>
            </Link>
            <p className="text-sm text-[#666] leading-relaxed">
              Your #1 Source for CoD Mobile Content
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#ff0000] hover:text-white transition-all duration-200"
                aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#5865F2] hover:text-white transition-all duration-200"
                aria-label="Discord">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.014.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#25D366] hover:text-white transition-all duration-200"
                aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded flex items-center justify-center bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#1877F2] hover:text-white transition-all duration-200"
                aria-label="Facebook">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-heading font-bold uppercase tracking-wider text-xs text-[#666] mb-4">Pages</p>
            <ul className="space-y-2.5">
              {[
                { label: "Blog", href: "/blog" },
                { label: "Videos", href: "/videos" },
                { label: "Tools", href: "/tools" },
                { label: "Community", href: "/community" },
                { label: "About", href: "/about" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#a0a0a0] hover:text-[#aaff00] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading font-bold uppercase tracking-wider text-xs text-[#666] mb-4">Legal</p>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#a0a0a0] hover:text-[#aaff00] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-heading font-bold uppercase tracking-wider text-xs text-[#666] mb-4">Stay Updated</p>
            <p className="text-sm text-[#666] mb-3">Get CoD Mobile news & guides in your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 min-w-0 px-3 py-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#aaff00] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded bg-[#aaff00] text-black text-sm font-heading font-bold uppercase tracking-wider hover:bg-[#88cc00] disabled:opacity-50 transition-all"
              >
                {submitting ? "..." : "Join"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-[#2a2a2a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#555]">© {new Date().getFullYear()} Inicio Official. All rights reserved.</p>
          <p className="text-xs text-[#444]">Not affiliated with Activision or TiMi Studios.</p>
        </div>
      </div>
    </footer>
  );
}

const links = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};
