"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Session = { id: string; duration_minutes: number; created_at: string };

export function RecentActivity() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch("/api/pomodoro")
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => setSessions([]));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sessions.slice(0, 5).map((s) => (
            <li key={s.id} className="text-sm flex justify-between">
              <span>{s.duration_minutes} min session</span>
              <span className="text-muted-foreground">
                {new Date(s.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-muted-foreground">No sessions yet.</p>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
