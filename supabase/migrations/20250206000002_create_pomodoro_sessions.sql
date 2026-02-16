create table public.pomodoro_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  duration_minutes integer not null,
  break_duration_minutes integer default 5,
  completed boolean default false,
  focus_score integer check (focus_score between 1 and 5),
  notes text,
  tags text[],
  created_at timestamptz default now()
);

create index idx_pomodoro_user_date on public.pomodoro_sessions(user_id, created_at desc);

alter table public.pomodoro_sessions enable row level security;

create policy "Users can CRUD own sessions"
  on public.pomodoro_sessions
  for all
  using (
    user_id = (select id from public.users where clerk_id = auth.uid()::text)
  );
