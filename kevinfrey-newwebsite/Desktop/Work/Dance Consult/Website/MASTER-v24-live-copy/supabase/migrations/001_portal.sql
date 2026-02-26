-- Enable uuid helpers
create extension if not exists "pgcrypto";

-- Profiles (Auth mirror)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('client','consultant','admin')) default 'client',
  full_name text not null,
  email text not null,
  timezone text,
  created_at timestamptz not null default now()
);

-- Client intake
create table if not exists public.client_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  intake_jsonb jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Consultants
create table if not exists public.consultants (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  display_name text not null,
  bio text,
  specialties text[] not null default '{}'::text[],
  calendly_url text,
  services text[] not null default '{}'::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  client_profile_id uuid references public.client_profiles(profile_id) on delete cascade,
  consultant_profile_id uuid references public.consultants(profile_id) on delete set null,
  status text not null check (status in ('pending','confirmed','completed')) default 'pending',
  start_time timestamptz,
  end_time timestamptz,
  source text not null check (source in ('calendly','custom')) default 'calendly',
  external_ref text,
  payment_status text not null check (payment_status in ('unpaid','paid','refunded')) default 'unpaid',
  focus text,
  created_at timestamptz not null default now()
);

-- Notes attached to bookings
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  source text not null default 'portal',
  raw_text text,
  structured_jsonb jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Utility function to read the caller's portal role
create or replace function public.portal_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Convenience helper
create or replace function public.portal_is_role(target_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.portal_role() = target_role;
$$;

-- Trigger to keep client_profiles.updated_at fresh
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_client_profile_updated_at on public.client_profiles;
create trigger set_client_profile_updated_at
before update on public.client_profiles
for each row
execute procedure public.touch_updated_at();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.client_profiles enable row level security;
alter table public.consultants enable row level security;
alter table public.bookings enable row level security;
alter table public.notes enable row level security;

-- Profiles policies
create policy "users can view their profile"
  on public.profiles
  for select
  using (auth.uid() = id or public.portal_is_role('admin'));

create policy "users create their profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "users update their profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "admins manage profiles"
  on public.profiles
  for all
  using (public.portal_is_role('admin'))
  with check (public.portal_is_role('admin'));

-- Client profile policies
create policy "clients read own intake"
  on public.client_profiles
  for select
  using (auth.uid() = profile_id);

create policy "clients write own intake"
  on public.client_profiles
  for insert
  with check (auth.uid() = profile_id);

create policy "clients update own intake"
  on public.client_profiles
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "consultants read assigned client intake"
  on public.client_profiles
  for select
  using (
    public.portal_is_role('consultant')
    and exists (
      select 1 from public.bookings
      where bookings.client_profile_id = client_profiles.profile_id
        and bookings.consultant_profile_id = auth.uid()
    )
  );

create policy "admins manage client intake"
  on public.client_profiles
  for all
  using (public.portal_is_role('admin'))
  with check (public.portal_is_role('admin'));

-- Consultant policies
create policy "published consultants readable"
  on public.consultants
  for select
  using (is_active or public.portal_is_role('admin'));

create policy "consultants update their card"
  on public.consultants
  for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create policy "admins manage consultants"
  on public.consultants
  for all
  using (public.portal_is_role('admin'))
  with check (public.portal_is_role('admin'));

-- Booking policies
create policy "clients can view own bookings"
  on public.bookings
  for select
  using (client_profile_id = auth.uid());

create policy "clients can create bookings"
  on public.bookings
  for insert
  with check (client_profile_id = auth.uid());

create policy "consultants view assigned bookings"
  on public.bookings
  for select
  using (consultant_profile_id = auth.uid());

create policy "consultants update assigned bookings"
  on public.bookings
  for update
  using (consultant_profile_id = auth.uid())
  with check (consultant_profile_id = auth.uid());

create policy "admins manage bookings"
  on public.bookings
  for all
  using (public.portal_is_role('admin'))
  with check (public.portal_is_role('admin'));

-- Notes policies
create policy "clients read their booking notes"
  on public.notes
  for select
  using (
    exists (
      select 1 from public.bookings
      where bookings.id = notes.booking_id
        and bookings.client_profile_id = auth.uid()
    )
  );

create policy "clients add onset notes"
  on public.notes
  for insert
  with check (
    exists (
      select 1 from public.bookings
      where bookings.id = notes.booking_id
        and bookings.client_profile_id = auth.uid()
    )
  );

create policy "consultants read/write booking notes"
  on public.notes
  for all
  using (
    exists (
      select 1 from public.bookings
      where bookings.id = notes.booking_id
        and bookings.consultant_profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.bookings
      where bookings.id = notes.booking_id
        and bookings.consultant_profile_id = auth.uid()
    )
  );

create policy "admins manage notes"
  on public.notes
  for all
  using (public.portal_is_role('admin'))
  with check (public.portal_is_role('admin'));
