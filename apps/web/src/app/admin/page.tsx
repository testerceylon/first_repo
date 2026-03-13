"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  CalendarDays,
} from "lucide-react";

interface Analytics {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color = "violet",
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  color?: string;
}) {
  const colors: Record<string, string> = {
    violet: "from-violet-500 to-purple-600",
    fuchsia: "from-fuchsia-500 to-pink-600",
    cyan: "from-cyan-500 to-blue-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-amber-600",
    rose: "from-rose-500 to-red-600",
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${colors[color] ?? colors.violet} text-white`}
        >
          <Icon className="size-5" />
        </div>
      </div>
      <p className="text-3xl font-bold font-heading">{(value ?? 0).toLocaleString()}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="size-10 rounded-lg bg-muted" />
      </div>
      <div className="h-8 w-20 bg-muted rounded" />
      <div className="mt-1 h-3 w-32 bg-muted rounded" />
    </div>
  );
}

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Use empty base so the request routes through the Next.js proxy,
        // ensuring the session cookie is included (same-origin).
        const base = "";
        const res = await fetch(`${base}/api/admin/analytics`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening across Inicio Official.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : analytics ? (
          <>
            <StatCard
              title="Total Users"
              value={analytics.totalUsers}
              icon={Users}
              description="All registered accounts"
              color="violet"
            />
            <StatCard
              title="New This Month"
              value={analytics.newUsersThisMonth}
              icon={CalendarDays}
              description="Signups this month"
              color="cyan"
            />
            <StatCard
              title="New This Week"
              value={analytics.newUsersThisWeek}
              icon={UserPlus}
              description="Signups this week"
              color="orange"
            />
          </>
        ) : null}
      </div>


    </div>
  );
}
