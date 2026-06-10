# DOX — Referencias

## Purpose
Directorio de fuentes vivas para consulta de la IA. URLs a banlists, tier lists, top decks, rulings y bases de datos de cartas.

## Ownership
- Todos los archivos `Referencia - *.md`

## Frontmatter requerido
```
tipo: referencia
nombre: string
url: string (URL completa)
categoria: banlist | tier-list | deck-db | rulings | noticias
prioridad: alta | media | baja
ultima_consulta: YYYY-MM-DD
tags:
  - ygo/referencia
  - ygo/{categoria}
```

## Work Guidance
- Cada referencia debe tener URL funcional
- Si una URL no responde durante fetch, marcarla con nota en contenido
- NO editar URLs sin confirmación del usuario
- Agregar nuevas referencias cuando el usuario mencione una fuente nueva

## Child DOX Index
Sin hijos.
