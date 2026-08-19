-- ============================================================================
-- Julián Tavano — Panel autoadministrable
-- Migración inicial: tablas, RLS, storage.
--
-- Ejecutar en Supabase → SQL Editor (o `supabase db push` si usás la CLI).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Allowlist de administradores
--    Ningún usuario puede escribir nada si no está en esta tabla, aunque
--    logre crearse una cuenta. La tabla sólo se administra desde el dashboard
--    de Supabase (no hay policy de INSERT para usuarios).
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- SECURITY DEFINER para evitar recursión de RLS al consultarse desde policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Un admin puede ver la lista de admins; nadie puede modificarla vía API.
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. Trigger de updated_at
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Prototipos (modelos de casas)
-- ---------------------------------------------------------------------------
create table if not exists public.prototipos (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  type              text not null check (type in ('casa', 'cabaña')),
  name              text not null,
  tagline_es        text not null default '',
  tagline_en        text not null default '',
  description_es    text not null default '',
  description_en    text not null default '',
  covered_area      numeric not null default 0 check (covered_area >= 0),
  semi_covered_area numeric check (semi_covered_area is null or semi_covered_area >= 0),
  bedrooms          integer not null default 1 check (bedrooms >= 0),
  bathrooms         integer not null default 1 check (bathrooms >= 0),
  features_es       text not null default '',
  features_en       text not null default '',
  published         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists prototipos_order_idx on public.prototipos (sort_order, created_at);

drop trigger if exists prototipos_touch on public.prototipos;
create trigger prototipos_touch before update on public.prototipos
  for each row execute function public.touch_updated_at();

create table if not exists public.prototipo_images (
  id           uuid primary key default gen_random_uuid(),
  prototipo_id uuid not null references public.prototipos(id) on delete cascade,
  src          text not null,
  alt          text not null default '',
  caption      text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists prototipo_images_parent_idx
  on public.prototipo_images (prototipo_id, sort_order);

-- ---------------------------------------------------------------------------
-- 4. Obras (mapa interactivo)
--    lat/lng se guardan por separado y con CHECK de rango — el front arma
--    el par [lng, lat] que espera Leaflet.
-- ---------------------------------------------------------------------------
create table if not exists public.obras (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  location       text not null default '',
  address        text,
  lat            double precision not null check (lat between -90 and 90),
  lng            double precision not null check (lng between -180 and 180),
  description_es text,
  description_en text,
  year           integer check (year is null or (year between 1900 and 2200)),
  category       text not null default 'vivienda'
                 check (category in ('vivienda', 'comercial', 'modular', 'ampliacion')),
  published      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists obras_order_idx on public.obras (sort_order, created_at);

drop trigger if exists obras_touch on public.obras;
create trigger obras_touch before update on public.obras
  for each row execute function public.touch_updated_at();

create table if not exists public.obra_images (
  id         uuid primary key default gen_random_uuid(),
  obra_id    uuid not null references public.obras(id) on delete cascade,
  src        text not null,
  alt        text not null default '',
  caption    text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists obra_images_parent_idx on public.obra_images (obra_id, sort_order);

-- ---------------------------------------------------------------------------
-- 5. Inversiones / fideicomisos
-- ---------------------------------------------------------------------------
create table if not exists public.inversiones (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  nombre     text not null,
  tipo       text not null default 'Fideicomiso',
  ubicacion  text not null default '',
  detalle    text not null default '',
  estado     text not null default 'En desarrollo',
  entrega    text,
  pdf_url    text,
  published  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inversiones_order_idx on public.inversiones (sort_order, created_at);

drop trigger if exists inversiones_touch on public.inversiones;
create trigger inversiones_touch before update on public.inversiones
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 6. Row Level Security
--    Lectura pública SÓLO de filas publicadas. Escritura sólo para admins.
-- ---------------------------------------------------------------------------
alter table public.prototipos       enable row level security;
alter table public.prototipo_images enable row level security;
alter table public.obras            enable row level security;
alter table public.obra_images      enable row level security;
alter table public.inversiones      enable row level security;

-- Tablas principales -------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['prototipos', 'obras', 'inversiones'] loop
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format($f$
      create policy %I on public.%I for select
        to anon, authenticated
        using (published or public.is_admin())
    $f$, t || '_public_read', t);

    execute format('drop policy if exists %I on public.%I', t || '_admin_write', t);
    execute format($f$
      create policy %I on public.%I for all
        to authenticated
        using (public.is_admin())
        with check (public.is_admin())
    $f$, t || '_admin_write', t);
  end loop;
end $$;

-- Tablas de imágenes -------------------------------------------------------
drop policy if exists "prototipo_images_public_read" on public.prototipo_images;
create policy "prototipo_images_public_read"
  on public.prototipo_images for select
  to anon, authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.prototipos p
      where p.id = prototipo_id and p.published
    )
  );

drop policy if exists "prototipo_images_admin_write" on public.prototipo_images;
create policy "prototipo_images_admin_write"
  on public.prototipo_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "obra_images_public_read" on public.obra_images;
create policy "obra_images_public_read"
  on public.obra_images for select
  to anon, authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.obras o
      where o.id = obra_id and o.published
    )
  );

drop policy if exists "obra_images_admin_write" on public.obra_images;
create policy "obra_images_admin_write"
  on public.obra_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Storage — buckets públicos de lectura, escritura sólo admin
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('prototipos',  'prototipos',  true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('obras',       'obras',       true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('inversiones', 'inversiones', true, 26214400,
   array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('prototipos', 'obras', 'inversiones'));

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id in ('prototipos', 'obras', 'inversiones') and public.is_admin())
  with check (bucket_id in ('prototipos', 'obras', 'inversiones') and public.is_admin());
