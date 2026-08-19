# Julián Tavano Arquitectura — sitio web

Sitio bilingüe (español / inglés) del estudio de arquitectura Julián Tavano:
modelos de casas y cabañas, mapa interactivo de obras realizadas y proyectos de
inversión. Incluye un panel de administración para que el estudio cargue y
edite todo el contenido, y reciba las consultas del formulario.

## Stack

- **Next.js** (App Router) con React Server Components y Server Actions
- **TypeScript** y **Tailwind CSS**
- **Supabase** para datos y autenticación del panel
- **Cloudinary** para imágenes, con subida firmada desde el panel
- **next-intl** para el ruteo bilingüe (`/es`, `/en`)

## Estructura

```
app/[locale]/    Sitio público, una ruta por idioma
app/admin/       Panel protegido: modelos, obras, inversiones y consultas
components/      UI del sitio, del panel y del mapa
lib/             Supabase, Cloudinary, repositorios y esquemas de validación
messages/        Traducciones es / en
supabase/        Migraciones del esquema y seed del contenido
```

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar con las claves propias
npm run dev                  # localhost:3000
```

## Detalles de implementación

- Mapa de obras con geocodificación desde el panel (`app/api/admin/geocode`)
- Validación con esquemas compartidos entre el formulario y el servidor
- Publicar / despublicar por elemento, sin borrar el contenido
- Metadata por idioma con canónicas, `sitemap.xml` y JSON-LD
