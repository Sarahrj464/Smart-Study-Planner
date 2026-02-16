create table public.badges (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  icon text,
  xp_required integer not null,
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary'))
);

create table public.user_badges (
  user_id uuid references public.users(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

insert into public.badges (name, description, icon, xp_required, rarity) values
  ('First Steps', 'Complete your first Pomodoro session', '🎯', 0, 'common'),
  ('Week Warrior', 'Maintain a 7-day study streak', '🔥', 100, 'rare'),
  ('Focus Master', 'Complete 50 Pomodoro sessions', '🧠', 500, 'epic'),
  ('Time Lord', 'Study for 100 hours total', '⏰', 1000, 'legendary');

alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

create policy "Anyone can read badges"
  on public.badges for select
  using (true);

create policy "Users can read own user_badges"
  on public.user_badges for select
  using (
    user_id = (select id from public.users where clerk_id = auth.uid()::text)
  );
