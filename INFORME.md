# JT Arquitectura — Resumen del sitio web

## Qué se hizo

Se desarrolló el sitio web completo de **JT Arquitectura**, diseñado para presentar el estudio, los proyectos y los prototipos de vivienda de manera profesional y atractiva.

---

## Estructura del sitio

El sitio tiene tres páginas principales:

**1. Inicio (`/`)**
La página principal recorre el estudio de arriba a abajo con las siguientes secciones:
- **Intro animada** — una pantalla de bienvenida con el logo y el nombre del estudio.
- **Hero** — un carrusel de imágenes de impacto que resume las tres grandes propuestas: prototipos, proyectos a medida y obras realizadas.
- **Prototipos** — grilla con las cinco viviendas disponibles (cabañas y casas), cada una con imagen, superficie y acceso a su página detallada.
- **Proyectos a medida** — presentación del servicio de diseño personalizado.
- **Nosotros** — breve presentación del estudio y su filosofía.
- **Contacto** — formulario de contacto y datos de WhatsApp.

**2. Obras (`/obras`)**
Mapa interactivo con todos los proyectos construidos geolocalizados. Al hacer clic en cada marcador se despliega información y fotos del proyecto. Pensado para transmitir trayectoria y experiencia real.

**3. Prototipos (`/prototipos/[nombre]`)**
Cada prototipo tiene su propia página con galería de imágenes, ficha técnica (superficies, dormitorios, baños), descripción, usos sugeridos y llamada directa a WhatsApp para consultar. Las URLs son claras y descriptivas: `/prototipos/casa-jarilla`, `/prototipos/cabana-norte`, etc.

---

## Idiomas

El sitio está disponible en **español e inglés**. El idioma se detecta automáticamente y puede cambiarse desde el menú. La URL en inglés agrega el prefijo `/en/`.

---

## Últimos ajustes realizados

- Se corrigió un problema que impedía ver las imágenes de los prototipos al subir el sitio al hosting (las carpetas usaban un carácter especial que el servidor no interpretaba bien).
- Las URLs de cada prototipo ahora incluyen el nombre completo: `casa-jarilla`, `cabana-norte`, etc.
- Las imágenes en las tarjetas de prototipos ahora se muestran centradas correctamente.
- El texto "CONTACTO" en la sección de contacto se agrandó levemente.

---

## Pendiente

- **Formulario de contacto**: el diseño del formulario está listo, pero el envío de emails todavía no está conectado. Se puede integrar con un servicio de envío (se recomienda hablar con el desarrollador para definir cuál usar).
