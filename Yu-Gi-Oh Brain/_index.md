---
created: 2026-06-09
tags:
  - ygo/index
---

# Yu-Gi-Oh Brain

Base de conocimiento personal para Master Duel.

![[Arquetipos/Arquetipos.base]]

---

![[Mazos/Mazos.base]]

---

## Duel Log

Sesiones de duelo registradas. Cada sesión tiene fecha, deck usado, resultados y notas matchup.

![[Duel Log/Duel Log.base]]

### 📊 Estadísticas globales

```dataviewjs
// Agrega wins/losses por deck de todas las sesiones
const pages = dv.pages('#ygo/duels')

const stats = {}
for (const p of pages) {
  const deck = p.deck_usado
  if (!deck) continue
  if (!stats[deck]) stats[deck] = { wins: 0, losses: 0, sesiones: 0 }
  stats[deck].wins += p.wins || 0
  stats[deck].losses += p.losses || 0
  stats[deck].sesiones += 1
}

const rows = Object.entries(stats)
  .map(([deck, s]) => {
    const total = s.wins + s.losses
    const wr = total > 0 ? Math.round(s.wins / total * 100) + '%' : '-'
    return [deck, s.wins, s.losses, total, wr, s.sesiones]
  })
  .sort((a, b) => b[1] - a[1]) // sort by wins descending

dv.table(['Deck', 'W', 'L', 'Total', 'Winrate', 'Sesiones'], rows)
```

---

![[Ideas/Ideas.base]]

---

## Consultas

![[Referencias/Referencias.base]]
