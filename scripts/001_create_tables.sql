-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('admin', 'manager')),
  created_at timestamp with time zone default now()
);

-- Create guesthouses table
create table if not exists public.guesthouses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text,
  city text,
  country text,
  manager_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create rooms table
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  guesthouse_id uuid not null references public.guesthouses(id) on delete cascade,
  name text not null,
  description text,
  capacity integer not null default 1,
  price_per_night decimal(10, 2),
  created_at timestamp with time zone default now()
);

-- Create room_availability table
create table if not exists public.room_availability (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  notes text,
  created_at timestamp with time zone default now(),
  unique(room_id, date)
);

-- Create photos table
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  guesthouse_id uuid not null references public.guesthouses(id) on delete cascade,
  url text not null,
  caption text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.guesthouses enable row level security;
alter table public.rooms enable row level security;
alter table public.room_availability enable row level security;
alter table public.photos enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Guesthouses policies
-- Admins can view all guesthouses
create policy "Admins can view all guesthouses"
  on public.guesthouses for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Managers can view their own guesthouses
create policy "Managers can view their guesthouses"
  on public.guesthouses for select
  using (manager_id = auth.uid());

-- Admins can insert guesthouses
create policy "Admins can insert guesthouses"
  on public.guesthouses for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update any guesthouse
create policy "Admins can update guesthouses"
  on public.guesthouses for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Managers can update their own guesthouses
create policy "Managers can update their guesthouses"
  on public.guesthouses for update
  using (manager_id = auth.uid());

-- Admins can delete guesthouses
create policy "Admins can delete guesthouses"
  on public.guesthouses for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Rooms policies
-- Users can view rooms of guesthouses they have access to
create policy "Users can view rooms"
  on public.rooms for select
  using (
    exists (
      select 1 from public.guesthouses g
      inner join public.profiles p on p.id = auth.uid()
      where g.id = rooms.guesthouse_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

-- Managers and admins can insert rooms
create policy "Managers can insert rooms"
  on public.rooms for insert
  with check (
    exists (
      select 1 from public.guesthouses g
      inner join public.profiles p on p.id = auth.uid()
      where g.id = guesthouse_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

-- Managers and admins can update rooms
create policy "Managers can update rooms"
  on public.rooms for update
  using (
    exists (
      select 1 from public.guesthouses g
      inner join public.profiles p on p.id = auth.uid()
      where g.id = rooms.guesthouse_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

-- Managers and admins can delete rooms
create policy "Managers can delete rooms"
  on public.rooms for delete
  using (
    exists (
      select 1 from public.guesthouses g
      inner join public.profiles p on p.id = auth.uid()
      where g.id = rooms.guesthouse_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

-- Room availability policies
create policy "Users can view room availability"
  on public.room_availability for select
  using (
    exists (
      select 1 from public.rooms r
      inner join public.guesthouses g on g.id = r.guesthouse_id
      inner join public.profiles p on p.id = auth.uid()
      where r.id = room_availability.room_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

create policy "Users can manage room availability"
  on public.room_availability for all
  using (
    exists (
      select 1 from public.rooms r
      inner join public.guesthouses g on g.id = r.guesthouse_id
      inner join public.profiles p on p.id = auth.uid()
      where r.id = room_availability.room_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

-- Photos policies
create policy "Users can view photos"
  on public.photos for select
  using (
    exists (
      select 1 from public.guesthouses g
      inner join public.profiles p on p.id = auth.uid()
      where g.id = photos.guesthouse_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );

create policy "Users can manage photos"
  on public.photos for all
  using (
    exists (
      select 1 from public.guesthouses g
      inner join public.profiles p on p.id = auth.uid()
      where g.id = photos.guesthouse_id
      and (p.role = 'admin' or g.manager_id = auth.uid())
    )
  );
