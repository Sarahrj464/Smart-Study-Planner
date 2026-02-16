import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

/** GET /api/study-rooms/[roomId]/messages */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = await params;
  if (!roomId)
    return NextResponse.json({ error: "roomId required" }, { status: 400 });

  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Verify user is in room
  const { data: member } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .single();

  if (!member)
    return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });

  const { data: rows } = await supabase
    .from("room_messages")
    .select(`
      id,
      room_id,
      user_id,
      message,
      created_at
    `)
    .eq("room_id", roomId)
    .order("created_at", { ascending: true })
    .limit(100);

  // Enrich with user names (batch fetch)
  const userIds = [...new Set((rows ?? []).map((r) => r.user_id))];
  const { data: users } = await supabase
    .from("users")
    .select("id, name, avatar_url")
    .in("id", userIds);

  const userMap = new Map((users ?? []).map((u) => [u.id, u]));
  const messages = (rows ?? []).map((r) => ({
    ...r,
    users: userMap.get(r.user_id)
      ? { name: userMap.get(r.user_id)!.name, avatar_url: userMap.get(r.user_id)!.avatar_url }
      : null,
  }));

  return NextResponse.json({ messages });
}

/** POST /api/study-rooms/[roomId]/messages */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = await params;
  if (!roomId)
    return NextResponse.json({ error: "roomId required" }, { status: 400 });

  let body: { message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message)
    return NextResponse.json({ error: "message required" }, { status: 400 });

  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: member } = await supabase
    .from("room_members")
    .select("room_id")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .single();

  if (!member)
    return NextResponse.json({ error: "Not a member of this room" }, { status: 403 });

  const { data, error } = await supabase
    .from("room_messages")
    .insert({ room_id: roomId, user_id: user.id, message })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: data }, { status: 201 });
}
