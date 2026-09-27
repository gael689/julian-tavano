# Plan de cambios — revisión de Julián (sep/2026)

Fuentes: la lista de pedidos de Julián y el informe
`../Informe_revision_web_Julian_Tavano_Arquitectura.pdf` (3/ago/2026), más una
auditoría propia del sitio en producción y del código (27/sep/2026).

Estado (27/sep, tarde): **Etapa 1 hecha, Etapa 2 parcial** (paleta y favicon
aplicados; isotipo vectorizado y header nuevo, pendientes). Sin commitear
todavía — está en el working tree de la rama `limpio`. Detalle de qué se hizo
y qué falta, al final de cada etapa.

## Pedidos de Julián → dónde se resuelven

| Pedido | Etapa |
|---|---|
| La portada (Coihue) es la que menos lo identifica | 3 |
| Los renders se pueden robar → marca de agua | 5 |
| Completar la biografía (UNLP, etc.) | 4 |
| Cargar fotos de obras construidas | 4 |
| PDF del fideicomiso / escrito más informativo | **en pausa** |
| Falta el isotipo (como la "f" de Facebook) | 2 |
| Acceso más rápido a WhatsApp | 3 |
| El logo vacío a la izquierda queda raro | 2 |
| Footer: "casa que crece entre los árboles" | 3 |
| "Proyecto a medida" → "Proyecto nuevo" | 3 |
| Definir la paleta de colores | 2 |

## Decisiones tomadas (con Gael, 27/sep)

- **Portada:** Casa Cardón `07.jpg` (médano, pinos, cielo). Es costa atlántica
  reconocible, no bosque, y la de mayor resolución (2250×2813 → recorte 16:9 de
  2250×1266). Provisoria: pasa a una obra construida cuando lleguen las fotos.
  Alternativa: Cardón `01.jpg` (misma casa al atardecer). Descartada Casa Coral
  (palmeras y mar turquesa: no es la costa atlántica).
- **Logo:** no hay vector. Se vectoriza el isotipo JT y se arma una versión
  **rellena** (sólida) además del contorno actual.
- **Foto de Julián:** queda `public/about-image.jpg`.
- **Obras destacadas:** se piden a Julián. Se construye todo ahora; la sección
  de la home queda oculta hasta que haya al menos una obra destacada con fotos.
- **Los Aromos:** sin cambios por ahora (página, texto y PDF quedan como están).
- **Cantidad de obras:** las marcadas en el mapa. Hoy hay 44 publicadas con
  "Alpina Liliana" duplicada → **43**. El número se calcula del conteo real,
  no se escribe a mano.
- **Paleta:** la del informe, sin cambios (ver Etapa 2).
- **Tipografía:** no se cambia; Julián no lo pidió. Se mantiene Century Gothic.
  Nota: no se carga como fuente web, así que en Android y en PCs sin la fuente
  se ve la alternativa. Queda como mejora opcional, no en este plan.
- **Marca de agua:** los renders **ya tienen una**, pero es un texto chico
  verde claro arriba a la derecha ("JULIÁN TAVANO / ARQUITECTO") que casi no se
  ve y dice "Arquitecto" en vez de la marca. Se hace una nueva, más grande y
  visible, y **Julián la aprueba con una muestra antes de aplicarla** (Etapa 5).
- **Nombre de marca: NO se toca.** Es "Julián Tavano **Arquitecto**", tal cual
  lo dice él — así lo confirmó Gael el 27/sep después de que esta sesión lo
  cambiara por su cuenta a "Arquitectura" en la primera pasada de la Etapa 1
  (el logo y el pie de página ya decían "Arquitectura" antes de tocar nada;
  fue un hallazgo propio de la auditoría, nunca un pedido de Julián ni un ítem
  del informe, y no debió aplicarse sin preguntar). Se revirtió todo por
  completo. Si en algún momento se quiere unificar, es una decisión de
  Julián, no algo para resolver de oficio.
- **Borde entre secciones — "ola" en vez de línea recta** (sugerencia propia,
  inspirada en `estilo-mbk`, aprobada por Gael 27/sep tras ver
  [la comparación](https://claude.ai/artifact/RxeV2wPv7pMiZTkZNznj5c)): un SVG
  ondulado, sin color nuevo ni animación, entre 2 o 3 cortes clave de la home
  (candidatos: Hero→Modelos, Obras destacadas→Proyecto nuevo). Se descartan las
  "manchas de color" (los blobs de MBK): sin un color por concepto detrás,
  leen como decoración sin motivo. Se agrega como detalle de Etapa 3, a
  mostrar en contexto (no solo en la demo) antes de aplicarlo.

## Pendiente de Julián

1. Fotos y datos de las **6 obras destacadas**: nombre, ubicación, año,
   superficie, tipo de intervención, estado, descripción breve y 4 a 8 fotos.
2. Aprobar la **muestra de marca de agua**.
3. Si los tiene: los **renders originales sin marca** de cada modelo. Solo
   está el PDF fuente de Cabaña Brote; sin los demás, la marca nueva se suma a
   la vieja en vez de reemplazarla.

---

## Etapa 1 — Correcciones críticas ✅ hecho (27/sep)

- ✅ **Contadores en "+0 / 0%"** (`components/sections/About.tsx`): mostraban
  0 hasta que el scroll disparaba la animación (así lo vería cualquiera sin
  JS, y Google en una mala pasada). Se sacó la cuenta desde cero: ahora
  `getObrasCount()` calcula el conteo real en el servidor y llega ya con su
  valor final; sólo se anima la aparición (fade), nunca el número.
  Se bajó de 3 estadísticas a 2 — **obras construidas** (conteo real) y
  **años de trayectoria** (`año actual − 2018`, calculado, no escrito a mano).
  Se sacó "100% proyectos entregados" (no se podía comprobar). La matrícula
  no es una "estadística": va en el texto de la biografía (Etapa 4), no acá.
- ✅ **"+50" en todos lados** → interpolación `{count}` con el conteo real:
  `hero.subtitle`, `obras.title`/`title_home`/`home_desc` en
  `messages/es.json` y `en.json`, el FAQ del JSON-LD y la metadata de
  `/obras`. Verificado en vivo: hoy muestra **44** (matchea las obras
  publicadas en Supabase tal cual están); baja solo a 43 en cuanto se corra
  el punto siguiente.
- ✅ **Obras** — no se puede escribir en Supabase desde acá (las policies de
  RLS sólo dejan escribir a un admin logueado, y no hay service-role key en
  el repo). Se arregló lo que sí está en el repo y se dejó un SQL para correr
  a mano:
  - `lib/data/obras.ts` (el respaldo estático): sacado el duplicado
    `alpina-liliana-2`, "Supermercado Chino" pasado a `comercial`.
  - `supabase/fixes/2026-09-obras-cleanup.sql` — **falta correrlo en el SQL
    Editor de Supabase** para que se refleje en la base real (hoy sigue
    en 44 ahí, por eso el sitio en vivo también muestra 44).
  - Unificar los nombres ("Casa/Proyecto/Obra") y revisar los nombres de pila
    de clientes con Julián: **no se tocó**, para no perder datos sin su ok.
- ✅ **Idioma** — a `messages/es.json`/`en.json`: `about.eyebrow` ("SOBRE EL
  ESTUDIO"), `contact.eyebrow` ("CONTACTO"), `contact.form.surfaces` /
  `budgets` / `sending` / los dos placeholders, `nav.toggle_menu`. No se
  reprodujo "Casa Cardón Casa Cardón" (se revisó `ProtoCard`, `MorePrototipos`
  y `ProtoHeroSection`: no hay concatenación duplicada en el código actual).
  **Hallazgo nuevo, sin resolver:** `components/map/ObrasClient.tsx` (toda la
  página `/obras`) no usa `next-intl` — "Obras", "Volver al inicio", "Ver
  lista", etc. están fijos en español aunque la ruta tenga versión `/en`. Es
  un componente grande (622 líneas); no se tocó en esta pasada para no meter
  un refactor grande sin avisar — queda pendiente de decidir prioridad.
- ~~Marca unificada~~ **revertido** — ver "Nombre de marca" más arriba.

## Etapa 2 — Identidad (parcial)

- ✅ **Paleta** en `app/globals.css` (`@theme`): los 5 colores del informe
  existen tal cual (`--color-petroleo`, `--color-grafito`, `--color-hueso`,
  `--color-salvia`, `--color-arena`), y los tokens que ya usa el sitio
  (`olive-*`, `wood`, `charcoal*`, `cream*`, `concrete`) quedaron apuntando a
  esos mismos valores — el efecto visual ya es el de la paleta nueva en todo
  el sitio, sin renombrar clases en cientos de usos. Verificado con capturas
  (home, obras, mobile) y sin errores de consola.
  Dos ajustes sobre el hex exacto del informe, por contraste (WCAG AA):
  - `olive-soft` (fondo de Inversión y del header de `/obras`, que llevan
    texto encima) usa `#5F6C58` en vez de `#7D8978`: el salvia del informe da
    3.22:1 sobre hueso y no llega a AA para texto normal; así llega a 4.89:1.
  - `wood` (antes `#B8864E`, ya fallaba en 2.81:1) pasa a `#8A6339`: el arena
    del informe (`#D5C7B3`) es un acento de fondo, no un color para texto o
    botón con texto claro encima.
  - Se corrigieron también los hex escritos a mano: `#6B7A5A` en
    `Navigation.tsx` (ahora `bg-olive-soft`) y `rgba(58,74,42,…)` en
    `ObrasClient.tsx` (ahora el rgb de petróleo).
  - `themeColor`/`manifest.ts` actualizados a petróleo.
- ✅ **Favicon** (antes 404, con `logo.png` blanco-sobre-transparente como
  ícono): `app/favicon.ico`, `app/icon.png` y `app/apple-icon.png`, el
  isotipo (recortado del `icon.png` original, sin el texto "ARQUITECTURA")
  sobre un cuadrado petróleo. El favicon.ico usa una versión con el trazo
  engrosado — a 16 px el contorno fino del isotipo se pierde tal cual está.
  Sacado el bloque `icons` de la metadata: ahora Next sirve estos archivos
  por convención de nombre. Verificado: `<link rel="icon">` presente y con
  200 en dev.
- ⏳ **Isotipo vectorizado (relleno):** no se hizo. El mark actual es un
  dibujo de líneas finas (como un ícono de trazo), no una cinta hueca — no
  hay una forma "de rellenar" ahí adentro; una versión sólida de verdad es
  redibujarlo, y eso necesita el vector de Julián o un rediseño a mano. No
  se inventó una versión rellena de baja fidelidad para no entregar algo que
  después haya que rehacer.
- ⏳ **Header compacto con el isotipo relleno:** depende del punto anterior.
  No se tocó `Navigation.tsx` más que lo ya descripto en Etapa 1/paleta.

## Etapa 3 — Portada y contacto (arrancada: copy hecho, visual pendiente)

- **Hero** (`components/sections/Hero.tsx`):
  - Imagen: Casa Cardón `07.jpg`, recorte horizontal para escritorio y el
    vertical original para celular (`<picture>` o dos `Image` por breakpoint).
    ⏳ No hecho — implica recortar el asset y revisarlo en pantalla, se deja
    para la próxima pasada.
  - Título: "Arquitectura pensada para cada lugar." ⏳ No hecho (va junto con
    el cambio de imagen).
  - Bajada: "Diseñamos viviendas, espacios comerciales y desarrollos que
    conectan arquitectura, paisaje y forma de habitar." ⏳ No hecho.
  - **Se mantienen los 4 botones** (pedido explícito de Gael, 27/sep — no
    reducir). Sus 4 colores ya quedaron dentro de la paleta nueva (petróleo,
    arena-fuerte, grafito, salvia) al repuntar los tokens en la Etapa 2 —
    verificado por captura, conviven bien.
- ✅ **"Proyecto nuevo"**: nav, hero, sección (`CustomProjects.tsx`), opción
  del formulario, ES y EN ("New project"). Mensaje de sección: "Diseñamos tu
  proyecto desde cero" / "We design your project from scratch". El ancla
  `#proyectos-personalizados` quedó igual, como estaba previsto.
- ✅ **Footer:** "Arquitectura simple, honesta y conectada con el entorno." /
  "Simple, honest architecture connected to its surroundings." (`footer.tagline`).
- **WhatsApp**:
  - Número único en `lib/contact/` (hoy repetido en `Footer.tsx`,
    `Contact.tsx` y `modelos/[slug]/page.tsx`).
  - Componente `WhatsAppButton`: flotante fijo en todas las páginas, acceso en
    el header y barra inferior en celular "Consultar por WhatsApp".
  - Mensajes prearmados:
    - General: "Hola, vi la página de Julián Tavano Arquitectura y quisiera
      recibir información sobre un proyecto nuevo."
    - Por modelo u obra: "Hola, vi el proyecto [NOMBRE] en la web y quisiera
      recibir más información."
  - En el formulario, el botón de WhatsApp deja de estar en gris al 50%.
- **Formulario** (`Contact.tsx`): de 9 campos a nombre, WhatsApp o email,
  interés y mensaje. Zona, terreno, superficie y presupuesto pasan a opcionales
  y plegados. Ajustar `lib/contact/schema.ts` si cambia lo requerido.
- **Navegación:** sacar `target="_blank"` de Obras y de las tarjetas de
  modelos (rompe el "atrás" en celular). `/obras` muestra el header normal.

## Etapa 4 — Autoridad

- **Biografía** (`About.tsx` + messages), texto del informe:
  > Julián Tavano es arquitecto graduado en la Universidad Nacional de La Plata
  > en 2018, con Matrícula Provincial N.º 30.944.
  >
  > Nacido en Tandil y radicado en Monte Hermoso, desarrolla proyectos de
  > arquitectura en la costa atlántica y diferentes puntos del país.
  >
  > Su trabajo parte de una mirada simple y funcional: diseñar espacios
  > honestos, eficientes y llenos de vida, capaces de relacionarse con el
  > paisaje y responder a las necesidades reales de quienes los habitan.
  >
  > El estudio desarrolla viviendas, proyectos comerciales, construcción
  > modular, dirección de obra y emprendimientos de inversión, acompañando cada
  > proyecto desde la primera idea hasta su materialización.

  Foto: se mantiene `about-image.jpg`. Traducir al inglés.
- **Fichas de obra**:
  - Migración `supabase/migrations/2026…_obras_fichas.sql`: `surface`
    (numeric), `intervention` (text), `status` (text), `featured` (boolean,
    default false). Actualizar `lib/supabase/types.ts`, `lib/repo/mappers.ts`,
    `lib/data/obras.ts` (tipo `Obra`) y `lib/admin/schemas.ts`.
  - Panel: campos nuevos en `components/admin/ObraForm.tsx`.
  - Ruta pública `app/[locale]/obras/[slug]/page.tsx` con galería (reusar
    `ProtoGallery` / `LightboxProvider`), datos y WhatsApp con el nombre de la
    obra. Sumar a `app/sitemap.ts`.
  - Mapa: la tarjeta de una obra con fotos enlaza a su ficha.
- **Home — "Obras destacadas"**: hasta 6 obras con `featured = true` y fotos,
  en lugar de `ObrasTeaser`; el mapa queda como enlace. Oculta mientras no haya
  ninguna. Orden propuesto de la home: Hero → Obras destacadas → Proyecto nuevo
  → Modelos → Inversión → Sobre → Contacto → Ubicación.

## Etapa 5 — Marca de agua y rendimiento

- **Marca de agua nueva**, visible:
  - Isotipo JT relleno + "JULIÁN TAVANO ARQUITECTURA", abajo a la derecha,
    ~15–18 % del ancho, blanco al 50–60 % con sombra suave para que se lea en
    fondos claros y oscuros.
  - **Primero una muestra** en 2–3 renders (claro, oscuro, interior) para que
    Julián apruebe tamaño y opacidad. Recién después se aplica a todo.
  - Script nuevo `scripts/watermark.mjs` (sharp) que **no pisa originales**:
    lee de una carpeta de originales fuera de `public/` (gitignoreada) y
    escribe en `public/`. El script actual `scripts/watermark-coihue.mjs`
    sobrescribió el archivo; no reutilizar ese patrón.
  - Sin originales limpios, la marca nueva convive con la vieja (arriba a la
    derecha). Con Brote se puede regenerar limpia desde su PDF fuente
    (`extract_prototype_images.py`).
  - Imágenes cargadas desde el panel (Cloudinary): aplicar la marca como capa
    al servirlas, así lo que suba el estudio sale protegido solo.
  - Aclarar al cliente: la marca disuade, no impide la copia. No bloquear
    clic derecho.
- **Peso de imágenes** (`next.config.ts` tiene `unoptimized: true` por
  Hostinger): el mismo script genera WebP a 1800 / 1200 / 800 px con `srcset`.
  Hoy son JPG de 600–900 KB; el hero pesa 769 KB.
- Borrar ~9 MB de PNG sin uso: `public/proto-1..6.png`, `public/slide-1..3.png`.
- **Animación**: acortar o sacar `LetterboxIntro` (1,5 s antes de ver la
  portada), reducir `DarkenOnScrollOut` (filtro `brightness` en casi todas las
  secciones, caro en celulares) y respetar `prefers-reduced-motion`.

## Etapa 6 — Los Aromos (en pausa)

No se toca por ahora. Hallazgos para cuando se retome:
- La web dice "a 150 m de la playa"; el PDF dice "80 M DE LA PLAYA" en el mapa
  y "una cuadra y media" en el texto (se contradice solo).
- "Entrega Dic. 2026": confirmar vigencia.
- El PDF pesa 7,4 MB y tiene errores de tipeo ("luminosidadad", "disfruar",
  "estrategicamente").
- Propuesta del informe: página propia con texto informativo antes de la
  descarga, PDF con versión y fecha.

## Hallazgo suelto — mapa de `/obras` pedía API key de Carto ✅ resuelto (27/sep)

Al levantar el sitio en dev (27/sep) el mapa de `/obras` mostró el tile de
fondo tapado por "API KEY REQUIRED — carto.com/basemaps/apikey" en vez del
mapa base. **Se confirmó contra el server de Carto directamente (sin tocar
nada del sitio) que esto ya estaba roto en producción**, para cualquier
visitante: Carto cambió de política el 28/ago/2026 y el servicio gratuito sin
clave que usaba `ObrasMap.tsx` ahora devuelve, con 200 OK, un tile-aviso en
vez del mapa real.

Gael consiguió una key, pero probada directo contra Carto devuelve 403 "a
valid, authorized API key is required" — no es una key de **basemaps**
válida (posiblemente una key de otro producto de la plataforma Carto). Este
repo es público en GitHub — la key no se escribe acá ni truncada. Mientras se consigue la correcta en
[carto.com/basemaps/apikey](https://carto.com/basemaps/apikey/) (gratis,
~1 min, sin key hoy conocida que ande), se cambió a tiles de OpenStreetMap
sin clave (`components/map/ObrasMap.tsx`), con un filtro CSS
(`.map-tiles-muted` en `ObrasClient.tsx`) para que no choque tanto con la
paleta cream/petróleo. Los pines del mapa también se pasaron a la paleta
nueva (estaban en el hex viejo, escrito a mano en un SVG inline).

Si llega la key correcta: cargarla en `NEXT_PUBLIC_CARTO_API_KEY` (ver
`.env.example`) y el código vuelve a Voyager solo, sin tocar nada más — ya
está la rama con `if (cartoKey)` armada en `ObrasMap.tsx`. **Falta cargar esa
misma variable en Hostinger cuando exista**, no solo en `.env.local`.

## Etapa 7 — Control final

- `www.juliantavano.com.ar` y el dominio sin www responden los dos con 200:
  configurar 301 de `www` → sin www en Hostinger (la canónica ya es sin www).
- Verificar favicon y canónica con curl; purgar Open Graph en el debugger de
  Facebook y en LinkedIn Post Inspector (con y sin www).
- Revisión en celular y escritorio, ES y EN, enlaces, ortografía, metadata.
