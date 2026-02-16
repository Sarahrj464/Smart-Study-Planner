-- schedule format: [{ day, timeSlot, subject, room, color }]
create table public.timetables (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  is_active boolean default false,
  schedule jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_timetable_user on public.timetables(user_id, is_active);

alter table public.timetables enable row level security;

create policy "Users can manage own timetables"
  on public.timetables
  for all
  using (
    user_id = (select id from public.users where clerk_id = auth.uid()::text)
  );
