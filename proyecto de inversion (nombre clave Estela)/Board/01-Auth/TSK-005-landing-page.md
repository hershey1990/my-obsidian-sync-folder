---
id: TSK-005
fase: 1
modulo: Auth
tipo: frontend
prioridad: alta
dependencias: []
estimado: 1d
responsable: TBD
tags:
  - frontend
  - landing
  - nextjs
  - rsc
---

# TSK-005: Landing page + Header/Footer

Página pública de aterrizaje con SEO y navegación base.

## Entregables

### Landing page (`/`)
- React Server Component (RSC) con ISR
- Secciones: Hero, Cómo funciona, Features destacadas, CTA final
- SEO: metadata dinámica (title, description, opengraph, twitter cards)
- Header con estado de auth (logueado → nombre + avatar; no logueado → "Iniciar sesión")
- Footer con links: Términos, Privacidad, Contacto

### Componentes (@estela/ui)
- `shared/Header.tsx` — logo, nav links, auth indicator (user name / login btn)
- `shared/Footer.tsx` — links institucionales
- `public/HeroSection.tsx`
- `public/FeaturesSection.tsx`
- `public/HowItWorksSection.tsx`

### Archivos de configuración
- `apps/web/src/app/layout.tsx` — layout raíz con Header + Footer
- `apps/web/src/app/page.tsx` — landing page
- `apps/web/src/app/globals.css` — estilos base Tailwind

## Criterios de aceptación

1. Landing carga rápido (Lighthouse > 90 performance, > 90 SEO)
2. Header muestra "Iniciar sesión" si no hay cookie de sesión
3. Header muestra nombre + avatar del usuario si hay sesión activa
4. La landing es completamente estática (no requiere API)
5. Opengraph meta tags funcionan correctamente
6. ISR funcionando (revalidate cada 60s o webhook)

## Checklist de implementación

- [ ] Crear layout raíz con HTML meta tags
- [ ] Crear Header con auth indicator condicional
- [ ] Crear Footer
- [ ] Crear HeroSection
- [ ] Crear HowItWorksSection
- [ ] Crear FeaturesSection
- [ ] Crear CTA final
- [ ] Configurar ISR (revalidate)
- [ ] Probar Lighthouse
