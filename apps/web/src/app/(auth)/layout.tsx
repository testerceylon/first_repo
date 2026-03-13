import React from "react";
import type { Metadata } from "next";
import { SparklesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In"
};

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium group">
          <div className="bg-linear-to-r from-violet-600 to-fuchsia-600 text-white flex size-8 items-center justify-center rounded-lg shadow-lg shadow-violet-200 dark:shadow-violet-900/30 group-hover:scale-105 transition-transform">
            <SparklesIcon className="size-4" />
          </div>
          <span className="font-heading font-bold text-xl bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Inicio Official
          </span>
        </a>
        {children}
      </div>
    </div>
  );
}
