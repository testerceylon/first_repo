import Link from "next/link";
import { headers } from "next/headers";

const tools = [
  { href: "/tools/sensitivity", name: "Sensitivity Calc" },
  { href: "/tools/loadout", name: "Loadout Builder" },
  { href: "/tools/kd-calculator", name: "K/D Calculator" },
];

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Breadcrumb */}
      <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-2 font-body text-sm text-[#555]">
          <Link href="/" className="hover:text-[#aaff00] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#aaff00] transition-colors">Tools</Link>
          {pathname && pathname !== "/tools" && (
            <>
              <span>/</span>
              <span className="text-[#aaff00]">
                {tools.find((t) => pathname.startsWith(t.href))?.name ?? "Tool"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Cross-links */}
      <div className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="font-body text-xs px-3 py-1.5 rounded-full border border-[#2a2a2a] text-[#a0a0a0] hover:border-[#aaff00] hover:text-[#aaff00] transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}
