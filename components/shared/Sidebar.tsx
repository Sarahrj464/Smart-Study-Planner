"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pomodoro", label: "Pomodoro" },
  { href: "/timetable", label: "Timetable" },
  { href: "/wellness", label: "Wellness" },
  { href: "/study-rooms", label: "Study Rooms" },
  { href: "/blog", label: "Blog" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r bg-card p-4 flex flex-col">
      <Link href="/dashboard" className="font-semibold mb-6 px-2">
        Smart Study
      </Link>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
