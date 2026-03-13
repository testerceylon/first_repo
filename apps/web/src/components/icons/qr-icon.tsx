import { cn } from "@/lib/utils";

export function QrIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      {/* Top-left finder square */}
      <rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="7" y="7" width="4" height="4" rx="0.5" fill="currentColor" />

      {/* Top-right finder square */}
      <rect x="18" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="21" y="7" width="4" height="4" rx="0.5" fill="currentColor" />

      {/* Bottom-left finder square */}
      <rect x="4" y="18" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="7" y="21" width="4" height="4" rx="0.5" fill="currentColor" />

      {/* Data dots */}
      <rect x="18" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="22" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="26" y="18" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="18" y="22" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="26" y="22" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="22" y="26" width="3" height="3" rx="0.5" fill="currentColor" />
      <rect x="26" y="26" width="3" height="3" rx="0.5" fill="currentColor" />
    </svg>
  );
}
