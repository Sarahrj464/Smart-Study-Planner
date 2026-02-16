"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export function useUser() {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [dbUser, setDbUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!clerkUser) {
        setDbUser(null);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", clerkUser.id)
        .single();

      if (!error && data) setDbUser(data);
      setLoading(false);
    }

    if (isLoaded) fetchUser();
  }, [clerkUser?.id, isLoaded]);

  return {
    user: dbUser,
    clerkUser,
    loading: loading || !isLoaded,
  };
}
