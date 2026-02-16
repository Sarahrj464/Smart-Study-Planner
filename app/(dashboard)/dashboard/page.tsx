import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { StatCard } from "@/components/dashboard/StatCard";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Skeleton } from "@/components/ui/skeleton";

async function getDashboardStats() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
  const res = await fetch(`${base}/api/dashboard/stats`, {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });
  if (!res.ok) return { stats: null };
  const data = await res.json();
  return data;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { stats } = await getDashboardStats();

  if (!stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Unable to load stats. Check your API and Supabase setup.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total XP" value={stats.xp} icon="⭐" trend="+12% from last week" />
        <StatCard title="Current Level" value={stats.level} icon="🎯" />
        <StatCard title="Study Streak" value={`${stats.streak} days`} icon="🔥" />
        <StatCard title="Badges Earned" value={stats.badges} icon="🏆" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[300px]" />}>
          <WeeklyChart />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[300px]" />}>
          <RecentActivity />
        </Suspense>
      </div>
    </div>
  );
}
