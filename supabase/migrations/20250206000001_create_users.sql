-- Users table (synced from Clerk via webhook)
-- RLS: when using anon key, auth.uid() should match clerk_id (e.g. via custom JWT from Clerk)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  email text unique not null,
  name text not null,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  xp integer default 0,
  level integer generated always as (floor(xp / 100) + 1) stored,
  current_streak integer default 0,
  longest_streak integer default 0,
  settings jsonb default '{"darkMode": false, "notifications": true, "pomodoroLength": 25, "breakLength": 5}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid()::text = clerk_id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid()::text = clerk_id);

-- Service role bypasses RLS; API routes use service role and resolve user by clerk_id.
