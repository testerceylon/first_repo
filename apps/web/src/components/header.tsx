"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, ShieldCheck, Menu, X, Youtube } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Videos", href: "/videos" },
  { label: "Blog", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Community", href: "/community" },
];

const YOUTUBE_URL = "https://www.youtube.com/@inicioofficial";
const DISCORD_URL = "https://discord.gg/5QxDveWj85";

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          credentials: "include",
          onSuccess: () => { window.location.href = "/"; },
        },
      });
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur-xl shadow-lg shadow-black/50"
          : "border-b border-transparent bg-[#0a0a0a]/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="relative">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-200">
              <circle cx="14" cy="14" r="13" stroke="#aaff00" strokeWidth="1.5" />
              <path d="M14 6 L22 20 L14 16 L6 20 Z" fill="#aaff00" />
              <circle cx="14" cy="14" r="2" fill="#0a0a0a" />
              <line x1="14" y1="2" x2="14" y2="6" stroke="#aaff00" strokeWidth="1.5" />
              <line x1="14" y1="22" x2="14" y2="26" stroke="#aaff00" strokeWidth="1.5" />
              <line x1="2" y1="14" x2="6" y2="14" stroke="#aaff00" strokeWidth="1.5" />
              <line x1="22" y1="14" x2="26" y2="14" stroke="#aaff00" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-white group-hover:text-[#aaff00] transition-colors duration-200">
            INICIO <span className="text-[#aaff00]">OFFICIAL</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider transition-colors duration-150 ${
                  isActive
                    ? "text-[#aaff00]"
                    : "text-[#a0a0a0] hover:text-white"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#aaff00] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Discord button */}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-heading font-bold uppercase tracking-wider bg-[#5865F2] text-white hover:bg-[#4752C4] transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.014.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            Discord
          </a>

          {/* YouTube subscribe button */}
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-heading font-bold uppercase tracking-wider bg-[#ff0000] text-white hover:bg-[#cc0000] transition-all duration-200"
          >
            <Youtube className="w-3.5 h-3.5" />
            Subscribe
          </a>

          {/* Auth state */}
          {mounted && !isPending && session && (
            <div className="relative group ml-1">
              <button
                className="size-8 rounded-full bg-[#aaff00] flex items-center justify-center text-black text-xs font-heading font-bold ring-2 ring-transparent group-hover:ring-[#aaff00]/50 transition-all duration-200 cursor-pointer"
                aria-label="User menu"
              >
                {session.user.email?.[0]?.toUpperCase() ?? "?"}
              </button>
              <div className="absolute right-0 top-full mt-2.5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="absolute -top-1.5 right-3 size-3 rotate-45 bg-[#1a1a1a] border-l border-t border-[#2a2a2a] rounded-sm" />
                <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-xl overflow-hidden py-1">
                  <div className="px-3 py-2.5 border-b border-[#2a2a2a]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#666] mb-0.5">Signed in as</p>
                    <p className="text-xs text-[#a0a0a0] truncate">{session.user.email}</p>
                  </div>
                  {(session.user as any).role === "admin" && (
                    <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-[#aaff00] hover:bg-[#222] transition-colors">
                      <ShieldCheck className="size-4" />
                      Admin Panel
                    </Link>
                  )}
                  <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white hover:bg-[#222] transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-[#222] transition-colors"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {mounted && !isPending && !session && (
            <Link
              href="/signin"
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-xs font-heading font-bold uppercase tracking-wider text-[#a0a0a0] border border-[#2a2a2a] hover:border-[#aaff00] hover:text-[#aaff00] transition-all duration-200"
            >
              Sign In
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-1 p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-heading font-semibold uppercase tracking-wider transition-all ${
                pathname === href ? "text-[#aaff00] bg-[#aaff00]/10" : "text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-heading font-bold uppercase bg-[#ff0000] text-white">
              <Youtube className="w-3.5 h-3.5" />Subscribe
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-heading font-bold uppercase bg-[#5865F2] text-white">
              Discord
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
