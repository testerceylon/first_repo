"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  LogOut,
  SparklesIcon,
  ShieldCheck,
  MessageSquare,
  FileText,
  BarChart3,
  Inbox,
  Briefcase,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Sales",
    href: "/admin/sales",
    icon: TrendingUp,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    label: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    label: "Service Requests",
    href: "/admin/service-requests",
    icon: Inbox,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Briefcase,
  },
];



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/signin");
      } else if ((session.user as any).role !== "admin") {
        router.replace("/");
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex bg-background">
      {/* Sidebar - starts below the global sticky header (h-14) */}
      <aside className="fixed top-14 bottom-0 left-0 z-40 flex w-64 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-r from-violet-600 to-fuchsia-600">
            <SparklesIcon className="size-4 text-white" />
          </div>
          <div>
            <p className="font-heading font-bold text-sm bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Inicio Official
            </p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3" />
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold">
              {session.user.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{session.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  credentials: "include",
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              })
            }
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-[calc(100vh-3.5rem)] overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
