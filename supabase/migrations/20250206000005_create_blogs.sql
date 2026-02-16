create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  cover_image text,
  author_id uuid references public.users(id) on delete cascade,
  tags text[],
  published boolean default false,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.blog_likes (
  blog_id uuid references public.blogs(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (blog_id, user_id)
);

create index idx_blogs_published on public.blogs(published, created_at desc);
create index idx_blogs_slug on public.blogs(slug);

alter table public.blogs enable row level security;

create policy "Anyone can read published blogs"
  on public.blogs for select
  using (published = true);

create policy "Authors can manage own blogs"
  on public.blogs for all
  using (
    author_id = (select id from public.users where clerk_id = auth.uid()::text)
  );

alter table public.blog_likes enable row level security;

create policy "Users can manage own likes"
  on public.blog_likes for all
  using (
    user_id = (select id from public.users where clerk_id = auth.uid()::text)
  );
