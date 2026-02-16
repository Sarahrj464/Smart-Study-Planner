create table public.study_rooms (
  id uuid primary key default gen_random_uuid(),
  room_name text not null,
  room_code text unique not null,
  host_id uuid references public.users(id) on delete cascade,
  is_private boolean default false,
  password_hash text,
  max_members integer default 10,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.room_members (
  room_id uuid references public.study_rooms(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (room_id, user_id)
);

create table public.room_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.study_rooms(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz default now()
);

create index idx_messages_room on public.room_messages(room_id, created_at desc);

alter table public.study_rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.room_messages enable row level security;

create policy "Anyone can read active rooms"
  on public.study_rooms for select
  using (is_active = true);

create policy "Room members can read messages"
  on public.room_messages for select
  using (
    room_id in (
      select room_id from public.room_members
      where user_id = (select id from public.users where clerk_id = auth.uid()::text)
    )
  );

create policy "Room members can insert messages"
  on public.room_messages for insert
  with check (
    room_id in (
      select room_id from public.room_members
      where user_id = (select id from public.users where clerk_id = auth.uid()::text)
    )
  );

create policy "Users can manage rooms they host"
  on public.study_rooms for all
  using (
    host_id = (select id from public.users where clerk_id = auth.uid()::text)
  );

create policy "Users can manage own room_members"
  on public.room_members for all
  using (
    user_id = (select id from public.users where clerk_id = auth.uid()::text)
  );
