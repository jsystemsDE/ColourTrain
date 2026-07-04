-- Tables
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  profile_picture_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.training_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  variant_index int check (variant_index between 1 and 4) not null,
  variant_name text default 'variant' not null,
  config_data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, variant_index)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.training_configs enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can read own training configs"
  on public.training_configs for select
  using (auth.uid() = user_id);

create policy "Users can insert own training configs"
  on public.training_configs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own training configs"
  on public.training_configs for update
  using (auth.uid() = user_id);

-- Auto-create profile and default configs on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_config jsonb := '{"interval":"1000","colors":["#FF4A4A","#00FFA3","#FFD700","#FFFFFF"],"sounds":["beep"]}'::jsonb;
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );

  insert into public.training_configs (user_id, variant_index, variant_name, config_data)
  select
    new.id,
    i,
    'variant ' || i,
    default_config
  from generate_series(1, 4) as i;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
