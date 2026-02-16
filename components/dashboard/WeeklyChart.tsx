"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder for weekly study hours chart — extend with recharts or similar
export function WeeklyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly study time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
          Chart area — add recharts or Chart.js for bars/lines
        </div>
      </CardContent>
    </Card>
  );
}
