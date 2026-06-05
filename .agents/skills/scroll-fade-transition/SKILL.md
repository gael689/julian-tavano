---
name: scroll-fade-transition
description: Analiza y detalla cómo crear transiciones cinemáticas (oscurecimiento o aclarado progresivo) vinculadas al scroll entre secciones de distinto contraste usando Framer Motion.
---

# Transiciones de Contraste al Scrollear (Scroll Fade Transition)

## ¿De qué se trata?
En diseños modernos y de alta gama (especialmente ligados a arquitectura, moda o fotografía), el paso abrupto entre una sección clara (ej. fondo crema) y una oscura (ej. fondo carbón) puede romper la inmersión del usuario. 

Para solucionar esto, se implementa un **efecto cinemático de scroll**. A medida que la sección actual empieza a salir de la pantalla por arriba (scrolleando hacia abajo), **su brillo se altera progresivamente**: 
- Si vamos hacia una sección oscura, la sección actual **se oscurece** antes de desaparecer.
- Si vamos hacia una sección clara, la sección actual **se ilumina** antes de desaparecer.
Adicionalmente, se aplica un ligerísimo desplazamiento en Y (efecto *parallax* inverso) para dar una sensación de profundidad.

## ¿Cómo funciona técnicamente?
El efecto se logra sin ensuciar el DOM principal ni usar estados de React que maten el rendimiento. Se usa **Framer Motion** para atar valores CSS directamente al evento de scroll del navegador, saltándose el ciclo de renderizado de React.

1. `useScroll`: Escucha qué porcentaje de la sección específica ha pasado por el viewport (`scrollYProgress` va de `0` a `1`).
2. `useTransform`: Mapea ese porcentaje a valores concretos. Por ejemplo: si el scroll está en `0.1`, el brillo es `1`. Si el scroll está en `0.98`, el brillo baja a `0.45` (oscurecimiento).
3. `useMotionTemplate`: Permite inyectar esos valores fluidos dentro de un string de CSS complejo, como `filter: brightness(X)`.

## Implementación Base (`DarkenOnScrollOut.tsx`)

Este es el componente *Wrapper* que logra la magia. En este proyecto se encuentra en `components/ui/DarkenOnScrollOut.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

/**
 * variant="darken"  — Sección clara que se oscurece al salir (crema → oscuro)
 * variant="lighten" — Sección oscura que se ilumina al salir (oscuro → crema)
 */
export default function DarkenOnScrollOut({
  children,
  startAt = 0.08,
  variant = 'darken',
}: {
  children: React.ReactNode;
  startAt?: number;
  variant?: 'darken' | 'lighten';
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Mide el progreso del scroll específicamente para este contenedor
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'], 
    // "end start" significa: cuando el FINAL del div toque el PRINCIPIO de la pantalla.
  });

  // Si es darken, baja a 45% de brillo. Si es lighten, sube el brillo drásticamente (sobreexposición).
  const brightnessEnd = variant === 'lighten' ? 7 : 0.45;
  
  // Transformaciones fluidas
  const brightness = useTransform(scrollYProgress, [startAt, 0.98], [1, brightnessEnd]);
  const y          = useTransform(scrollYProgress, [startAt, 0.98], ['0%', '6%']);
  
  // Plantilla CSS inyectada en el DOM sin re-renders de React
  const filter     = useMotionTemplate`brightness(${brightness})`;

  return (
    <div ref={ref}>
      <motion.div style={{ filter, y, willChange: 'transform, filter' }}>
        {children}
      </motion.div>
    </div>
  );
}
```

## ¿Cómo se usa?

Basta con envolver la sección entera que se va a ir por arriba (la que sale de escena).

**Ejemplo 1: Pasando de Prototipos (Claro) a Proyectos Custom (Oscuro)**
```tsx
<DarkenOnScrollOut variant="darken" startAt={0.5}>
  <Prototipos /> {/* Esta sección se irá oscureciendo al hacer scroll down */}
</DarkenOnScrollOut>
<CustomProjects /> {/* Esta sección de fondo oscuro entrará por debajo */}
```

**Ejemplo 2: Pasando de Proyectos Custom (Oscuro) a Sobre Mí (Claro)**
```tsx
<DarkenOnScrollOut variant="lighten" startAt={0.7}>
  <CustomProjects /> {/* Al salir hacia arriba, se volverá hiper-brillante/blanca */}
</DarkenOnScrollOut>
<About /> {/* Entra la sección blanca normal */}
```

## Beneficios
- **Performance**: Al usar `willChange: 'transform, filter'` y valores inyectados por Framer Motion fuera del ciclo de React, funciona a 60fps constantes, incluso en móviles.
- **Inmersión**: Eleva drásticamente la calidad percibida (Premium Feel) al suavizar el impacto visual de los cortes de color drásticos típicos del diseño web tradicional.
