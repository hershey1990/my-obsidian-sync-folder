---
id: TSK-025
fase: 9
modulo: Lanzamiento
prioridad: alta
dependencias: ["TSK-005", "TSK-008", "TSK-011"]
estimado: 2d
---

# TSK-025: SEO (metadata, sitemap, ISR, OG tags)

Optimización para motores de búsqueda.

## Entregables
- Metadata dinámica en todas las páginas (Next.js generateMetadata)
- Open Graph tags para compartir en redes (imagen, título, descripción, precio)
- Sitemap.xml dinámico con todas las URLs públicas
- ISR configurado en landing, search, car detail
- Schema.org JSON-LD para carros (Product + Vehicle)
- Meta tags de SEO on-page (keywords, description por página)
- Google Search Console setup

## Criterios de aceptación
- Cada car detail tiene OG tags únicos (imagen del carro, precio, título)
- Sitemap incluye todas las URLs públicas
- ISR invalida caché al editar/publicar carro
- Schema.org se renderiza en HTML
- Lighthouse SEO score > 90
