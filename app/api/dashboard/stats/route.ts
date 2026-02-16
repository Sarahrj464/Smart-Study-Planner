import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

/** GET /api/dashboard/stats — aggregate stats for dashboard */
export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, xp, level, current_streak")
    .eq("clerk_id", userId)
    .single();

  if (userError || !user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Total completed study minutes
  const { data: sessions } = await supabase
    .from("pomodoro_sessions")
    .select("duration_minutes")
    .eq("user_id", user.id)
    .eq("completed", true);

  const totalMinutes = sessions?.reduce((acc, s) => acc + s.duration_minutes, 0) ?? 0;
  const totalHours = (totalMinutes / 60).toFixed(1);

  // This week's sessions
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data: weekSessions } = await supabase
    .from("pomodoro_sessions")
    .select("duration_minutes")
    .eq("user_id", user.id)
    .eq("completed", true)
    .gte("created_at", weekAgo.toISOString());

  const weeklyMinutes = weekSessions?.reduce((acc, s) => acc + s.duration_minutes, 0) ?? 0;
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);

  // Badges count
  const { count: badgesCount } = await supabase
    .from("user_badges")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return NextResponse.json({
    stats: {
      xp: user.xp ?? 0,
      level: user.level ?? 1,
      streak: user.current_streak ?? 0,
      totalHours,
      weeklyHours,
      badges: badgesCount ?? 0,
    },
  });
}
