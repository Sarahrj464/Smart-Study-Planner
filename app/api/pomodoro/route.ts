import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const sessionSchema = z.object({
  duration_minutes: z.number().min(1).max(60),
  break_duration_minutes: z.number().min(1).max(30).optional(),
  completed: z.boolean().optional(),
  focus_score: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/** GET /api/pomodoro — fetch current user's sessions */
export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ sessions: data ?? [] });
}

/** POST /api/pomodoro — create a session */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );

  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const insert = {
    user_id: user.id,
    duration_minutes: parsed.data.duration_minutes,
    break_duration_minutes: parsed.data.break_duration_minutes ?? 5,
    completed: parsed.data.completed ?? true,
    focus_score: parsed.data.focus_score ?? null,
    notes: parsed.data.notes ?? null,
    tags: parsed.data.tags ?? null,
  };

  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .insert(insert)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ session: data }, { status: 201 });
}
