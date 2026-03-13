import type { Metadata } from "next";
import Link from "next/link";
import { Youtube, Users, Gamepad2, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "About Inicio Official",
  description:
    "Learn about Inicio Official — a Call of Duty Mobile community and YouTube channel with 55K+ subscribers.",
};

const milestones = [
  { year: "2018", label: "Channel Founded", desc: "Started uploading CoD Mobile content." },
  { year: "2020", label: "10K Subscribers", desc: "Reached our first major milestone." },
  { year: "2022", label: "Community Built", desc: "Discord and WhatsApp community launched." },
  { year: "2024", label: "55K+ Subscribers", desc: "Growing stronger every week." },
];

const pillars = [
  {
    icon: Youtube,
    title: "Weekly Content",
    description: "Fresh CoD Mobile guides, tier lists, and gameplay highlights every week on YouTube.",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "A welcoming Discord server where players connect, find teams, and share strategies.",
  },
  {
    icon: Gamepad2,
    title: "Honest Guides",
    description: "We test everything ourselves. No theory crafting — only real gameplay experience.",
  },
  {
    icon: Trophy,
    title: "Competitive Focus",
    description: "From casual to ranked, we cover all playstyles with a focus on improvement.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="py-24 px-4 bg-[#0d0d0d] border-b border-[#1a1a1a] text-center">
        <span className="badge mb-3">About Us</span>
        <h1 className="section-title mx-auto mb-4">WHO WE ARE</h1>
        <p className="font-body text-[#666] max-w-2xl mx-auto text-lg leading-relaxed">
          Inicio Official is a Call of Duty Mobile community channel with 55K+ YouTube subscribers.
          We create guides, gameplay videos, and tier lists — and have built an active player community
          across Discord, WhatsApp, Facebook, and more.
        </p>
      </section>

      {/* Pillars */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="section-title text-center mx-auto mb-12">WHAT WE DO</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-gaming p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#aaff00]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#aaff00]" />
                </div>
                <h3 className="font-heading font-bold text-white text-base">{title}</h3>
                <p className="font-body text-sm text-[#666] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-[#0d0d0d] border-y border-[#1a1a1a]">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title text-center mx-auto mb-12">OUR JOURNEY</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[#1e1e1e] -translate-x-1/2" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#aaff00] border-2 border-[#0a0a0a] mt-1.5" />
                  {/* Content */}
                  <div
                    className={`pl-12 md:pl-0 md:w-5/12 ${
                      i % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10 md:text-left md:ml-auto"
                    }`}
                  >
                    <span className="font-heading font-bold text-[#aaff00] text-lg">{m.year}</span>
                    <h3 className="font-heading font-bold text-white text-base mt-0.5">{m.label}</h3>
                    <p className="font-body text-sm text-[#555] mt-1">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="font-heading font-bold text-3xl text-white uppercase mb-4">
          Ready to <span className="neon-text">JOIN US?</span>
        </h2>
        <p className="font-body text-[#555] max-w-md mx-auto mb-8">
          Subscribe to the channel and join our community platforms to level up your CoD Mobile game.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://www.youtube.com/@inicioofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-youtube"
          >
            <Youtube className="w-4 h-4" />
            Subscribe on YouTube
          </a>
          <Link href="/community" className="btn-outline">
            View All Platforms
          </Link>
        </div>
      </section>
    </main>
  );
}
