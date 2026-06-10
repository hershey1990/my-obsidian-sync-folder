# DOX — Yu-Gi-Oh Brain

## Purpose
Base de conocimiento personal para Yu-Gi-Oh Master Duel: almacenar arquetipos, deck lists, ideas generadas por IA, y servir como contexto para análisis y generación de ideas.

## Ownership
- Todo el contenido bajo `Yu-Gi-Oh Brain/`
- Sub-Árboles DOX: Arquetipos/, Mazos/, Ideas/, Plantillas/

## Local Contracts

### Idioma
- Todo el contenido en español
- Nombres de cartas en inglés (formato oficial de Master Duel)

### Frontmatter (YAML)
Toda nota debe tener frontmatter estructurado para Obsidian Bases y Dataview. Campos estándar:
- `tipo`: arquetipo | mazo | idea
- `nombre`: string
- `fecha_creacion`: YYYY-MM-DD
- `ultima_actualizacion`: YYYY-MM-DD
- `tags`: array con prefijo `ygo/`

Campos específicos van en cada sub-DOX.

### Convención de naming
`Tipo - Nombre.md`
Ej: `Arquetipo - Dark Magician.md`, `Mazo - Red-Eyes Metalmorph.md`

## Work Guidance

### Regla fundamental: vault first
- ANTES de crear cualquier mazo, idea o análisis:
  1. Leer arquetipos existentes en la base (`Yu-Gi-Oh Brain/Arquetipos/`)
  2. Leer mazos existentes (`Yu-Gi-Oh Brain/Mazos/`)
  3. Leer ideas existentes (`Yu-Gi-Oh Brain/Ideas/`) — evitar duplicados
  4. Solo si falta información actual (banlist, sets nuevos, top cuts), buscar en web
- El vault es la fuente de verdad. La web es complemento, no origen.
- No generar contenido basado en training data interna si contradice o ignora lo que ya está en el vault.

### Cómo alimentar la base
1. Usuario proporciona URL (masterduelmeta.com, ygoprodeck.com, yugipedia.com) o deck list
2. IA extrae: arquetipo principal, engine, variantes, deck list, posición en meta
3. IA crea/actualiza la nota correspondiente con frontmatter correcto
4. IA actualiza el AGENTS.md del sub-árbol si cambia la estructura

### Cómo generar ideas de decks
1. Leer arquetipos y mazos existentes en la base
2. Identificar engines compatibles (ej: Diabellstar puede ir con Snake-Eye, Runick, etc.)
3. Proponer combinaciones con: premisa, core combo, deck list sugerida, viabilidad
4. Crear nota en Ideas/ con tipo: idea, origen: ia

### Consulta de fuentes (Referencias/)
- ANTES de generar cualquier contenido que requiera data actual:
  1. Leer `Referencias/Referencias.base` — obtener URLs activas por categoría
  2. Si la referencia tiene prioridad **alta** y la data puede estar desactualizada → hacer webfetch
  3. Si la referencia es **banlist** → siempre consultar antes de armar un mazo
  4. Si una URL no responde → marcarla en la nota y no re-intentar en la sesión
- El vault es fuente de verdad para arquetipos ya documentados
- Las referencias son para **actualizar** (banlist, top cuts nuevos) o **crear** (arquetipos nuevos)

### Fuentes autorizadas
- masterduelmeta.com — tier lists, decks ganadores, tech stats
- ygoprodeck.com — deck lists, precios, top cuts
- yugipedia.com — rulings, lore, historia de arquetipos

### Actualización de contenido
- Cuando el meta cambia (banlist, nuevo set), actualizar arquetipos afectados
- Marcar estado del arquetipo: explorando | activo | archivado
- Marcar estado del mazo: idea | en-construccion | completado | optimizado | archivado

## Verification
- Toda nota debe tener frontmatter válido
- Enlaces a fuentes externos deben ser URLs completas y funcionales
- Tags deben seguir la convención `ygo/...`

## Child DOX Index
| Child | Scope |
|---|---|
| `Arquetipos/AGENTS.md` | Fichas de arquetipos |
| `Mazos/AGENTS.md` | Deck lists |
| `Ideas/AGENTS.md` | Ideas generadas (IA/propias) |
| `Plantillas/AGENTS.md` | Reglas de templates |
| `Referencias/AGENTS.md` | Fuentes web (banlist, tier lists, decks) |
