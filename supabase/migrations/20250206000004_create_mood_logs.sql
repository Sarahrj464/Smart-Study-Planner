create table public.mood_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  mood integer not null check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  note text,
  activities text[],
  weather text,
  created_at timestamptz default now()
);

create index idx_mood_user_date on public.mood_logs(user_id, created_at desc);

alter table public.mood_logs enable row level security;

create policy "Users can manage own mood logs"
  on public.mood_logs
  for all
  using (
    user_id = (select id from public.users where clerk_id = auth.uid()::text)
  );
