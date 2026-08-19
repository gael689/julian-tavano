-- ============================================================================
-- Julián Tavano — Formulario de contacto
-- Tabla `consultas` + función de alta con rate-limit (RLS-safe).
-- ============================================================================

create table if not exists public.consultas (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  interest   text not null check (interest in ('interest_proto', 'interest_custom', 'interest_general')),
  zone       text,
  surface    text,
  budget     text,
  land       text check (land in ('land_yes', 'land_no', 'land_process')),
  message    text,
  status     text not null default 'nuevo' check (status in ('nuevo', 'leido', 'archivado')),
  ip         text,
  created_at timestamptz not null default now()
);

create index if not exists consultas_created_idx on public.consultas (created_at desc);
create index if not exists consultas_status_idx on public.consultas (status, created_at desc);

alter table public.consultas enable row level security;

-- Sin policy de insert/select para anon: el alta pasa únicamente por la
-- función `submit_consulta` (security definer, bypassea RLS) para poder
-- chequear el rate-limit sin darle a un visitante anónimo permiso de leer
-- la tabla.
drop policy if exists "consultas_admin_select" on public.consultas;
create policy "consultas_admin_select"
  on public.consultas for select
  to authenticated
  using (public.is_admin());

drop policy if exists "consultas_admin_update" on public.consultas;
create policy "consultas_admin_update"
  on public.consultas for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "consultas_admin_delete" on public.consultas;
create policy "consultas_admin_delete"
  on public.consultas for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Alta pública con rate-limit: máx. 3 consultas cada 10 minutos por IP o
-- por mail. Corre con los privilegios del owner (bypassea RLS), así que no
-- hace falta abrir insert/select de la tabla a `anon`.
-- ---------------------------------------------------------------------------
create or replace function public.submit_consulta(
  p_name     text,
  p_email    text,
  p_phone    text,
  p_interest text,
  p_zone     text,
  p_surface  text,
  p_budget   text,
  p_land     text,
  p_message  text,
  p_ip       text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count integer;
  new_id uuid;
begin
  select count(*) into recent_count
  from public.consultas
  where created_at > now() - interval '10 minutes'
    and (ip = p_ip or email = p_email);

  if recent_count >= 3 then
    raise exception 'rate_limited: demasiadas consultas, probá de nuevo en unos minutos';
  end if;

  insert into public.consultas (name, email, phone, interest, zone, surface, budget, land, message, ip)
  values (p_name, p_email, p_phone, p_interest, p_zone, p_surface, p_budget, p_land, p_message, p_ip)
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_consulta from public;
grant execute on function public.submit_consulta to anon, authenticated;
