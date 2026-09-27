-- Limpieza Etapa 1 (revisión sep/2026) — correr a mano en el SQL Editor de
-- Supabase. No se aplica desde el repo: las escrituras públicas están
-- restringidas por RLS a usuarios admin logueados (ver lib/admin/guard.ts),
-- y acá no hay service-role key.
--
-- Confirmado contra la base el 27/sep/2026:
--   alpina-liliana    (-38.990583, -61.218472)
--   alpina-liliana-2  (-38.990639, -61.218472)  ← ~6 m de distancia, mismo nombre
--   supermercado-chino                          ← cargado como 'vivienda'

-- 1) Duplicado: despublicar la copia (no se borra, por si hace falta revisar).
--    Si "alpina-liliana-2" es en realidad una obra distinta con nombre repetido,
--    no correr esto: renombrarla en el panel en vez de despublicarla.
update public.obras
set published = false
where slug = 'alpina-liliana-2';

-- 2) Categoría incorrecta.
update public.obras
set category = 'comercial'
where slug = 'supermercado-chino';
