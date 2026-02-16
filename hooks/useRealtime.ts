"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type RoomMessage = {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
  users?: { name: string; avatar_url: string | null } | null;
};

/**
 * Fetch and optionally subscribe to study room messages.
 * With Clerk auth, RLS may block client-side Supabase; we fetch via API and
 * poll for updates. For full realtime, configure Supabase custom JWT from Clerk.
 */
export function useStudyRoomMessages(roomId: string, options?: { pollIntervalMs?: number }) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const pollInterval = options?.pollIntervalMs ?? 5000;

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    const res = await fetch(`/api/study-rooms/${roomId}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, pollInterval);
    return () => clearInterval(interval);
  }, [fetchMessages, pollInterval]);

  const sendMessage = useCallback(
    async (message: string) => {
      const res = await fetch(`/api/study-rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) await fetchMessages();
    },
    [roomId, fetchMessages]
  );

  return { messages, sendMessage, loading, refetch: fetchMessages };
}
