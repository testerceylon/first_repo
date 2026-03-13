import { cn } from "@/lib/utils";

export function CropIcon({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {/* Horizontal crop line from left */}
      <line x1="2" y1="10" x2="22" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Vertical drop from horizontal line */}
      <line x1="22" y1="10" x2="22" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Vertical crop line from top */}
      <line x1="10" y1="2" x2="10" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Horizontal from vertical line */}
      <line x1="10" y1="22" x2="30" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

      {/* Inner selection box — dashed */}
      <rect x="13" y="13" width="6" height="6" rx="1" stroke="white" strokeWidth="1.5" strokeDasharray="2 1.5" fill="none" opacity="0.7" />
    </svg>
  );
}
