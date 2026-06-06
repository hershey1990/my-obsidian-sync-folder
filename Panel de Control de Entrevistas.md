---
tags:
  - panel
---

# 🎯 Panel de Control de Entrevistas

> Haz clic en el estado de cualquier candidato para cambiarlo directamente desde esta tabla. Los cambios se guardan automáticamente en el archivo.

---

## 📊 Ranking General

```dataviewjs
const statusLabels = {
  "en_proceso":  { label: "⏳ En Proceso",  color: "#3b82f6" },
  "aprobado":    { label: "✅ Aprobado",    color: "#22c55e" },
  "en_espera":   { label: "🟡 En Espera",   color: "#f59e0b" },
  "rechazado":   { label: "❌ Rechazado",   color: "#ef4444" },
};

const pages = dv.pages('"Interviews"')
  .where(p => p.tipo === "entrevista")
  .sort(p => p.puntaje_tecnico, 'desc');

const container = this.container;

// Inject styles once
if (!document.getElementById("dv-interview-styles")) {
  const style = document.createElement("style");
  style.id = "dv-interview-styles";
  style.textContent = `
    .iv-table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
    .iv-table th {
      text-align: left; padding: 8px 12px;
      border-bottom: 2px solid var(--background-modifier-border);
      color: var(--text-muted); font-weight: 600; font-size: 0.8em;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .iv-table td { padding: 8px 12px; border-bottom: 1px solid var(--background-modifier-border); vertical-align: middle; }
    .iv-table tr:hover td { background: var(--background-secondary); }
    .iv-score {
      display: inline-block; font-weight: 700; font-size: 1em;
      padding: 2px 8px; border-radius: 4px;
    }
    .iv-score-high  { background: #16a34a22; color: #4ade80; }
    .iv-score-mid   { background: #d9770622; color: #fb923c; }
    .iv-score-low   { background: #dc262622; color: #f87171; }
    .iv-status-select {
      border: none; border-radius: 6px; padding: 4px 10px;
      font-size: 0.85em; font-weight: 600; cursor: pointer;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 8px center;
      padding-right: 28px; transition: opacity 0.2s;
    }
    .iv-status-select:hover { opacity: 0.85; }
    .iv-stack-badge {
      display: inline-block; font-size: 0.75em; font-weight: 600;
      padding: 2px 8px; border-radius: 20px;
      background: var(--background-secondary); color: var(--text-muted);
      border: 1px solid var(--background-modifier-border);
    }
  `;
  document.head.appendChild(style);
}

function scoreClass(val) {
  if (!val) return "";
  if (val >= 7.5) return "iv-score-high";
  if (val >= 6) return "iv-score-mid";
  return "iv-score-low";
}

function makeScoreCell(val) {
  const span = document.createElement("span");
  span.className = `iv-score ${scoreClass(val)}`;
  span.textContent = val != null ? val : "—";
  return span;
}

function makeStatusSelect(page) {
  const file = app.vault.getAbstractFileByPath(page.file.path);
  const select = document.createElement("select");
  select.className = "iv-status-select";

  const statuses = ["en_proceso", "aprobado", "en_espera", "rechazado"];
  statuses.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = statusLabels[s].label;
    if (page.resultado === s) opt.selected = true;
    select.appendChild(opt);
  });

  function applyColor() {
    const info = statusLabels[select.value] || { color: "#888" };
    select.style.background = info.color + "33";
    select.style.color = info.color;
    select.style.border = `1px solid ${info.color}66`;
  }
  applyColor();

  select.addEventListener("change", async () => {
    await app.fileManager.processFrontMatter(file, fm => {
      fm.resultado = select.value;
    });
    applyColor();
  });

  return select;
}

// Build table
const table = document.createElement("table");
table.className = "iv-table";

// Header
const thead = table.createTHead();
const hrow = thead.insertRow();
["Candidato", "Cliente", "Stack", "🧠 Técnico", "🌐 Inglés", "Estado"].forEach(h => {
  const th = document.createElement("th");
  th.textContent = h;
  hrow.appendChild(th);
});

// Body
const tbody = table.createTBody();
for (const page of pages) {
  const tr = tbody.insertRow();

  // Candidato (link)
  const tdName = tr.insertCell();
  const link = document.createElement("a");
  link.textContent = page.candidato || page.file.name;
  link.className = "internal-link";
  link.href = page.file.path;
  link.setAttribute("data-href", page.file.path);
  link.onclick = (e) => { e.preventDefault(); app.workspace.openLinkText(page.file.path, '', false); };
  tdName.appendChild(link);

  // Cliente
  tr.insertCell().textContent = page.empresa || "—";

  // Stack
  const tdStack = tr.insertCell();
  const badge = document.createElement("span");
  badge.className = "iv-stack-badge";
  badge.textContent = page.puesto || "—";
  tdStack.appendChild(badge);

  // Técnico
  tr.insertCell().appendChild(makeScoreCell(page.puntaje_tecnico));

  // Inglés
  tr.insertCell().appendChild(makeScoreCell(page.puntaje_ingles));

  // Estado
  tr.insertCell().appendChild(makeStatusSelect(page));
}

container.appendChild(table);
```

---

## 🔍 Por Stack Tecnológico

```dataviewjs
const statusLabels = {
  "en_proceso": { label: "⏳ En Proceso", color: "#3b82f6" },
  "aprobado":   { label: "✅ Aprobado",   color: "#22c55e" },
  "en_espera":  { label: "🟡 En Espera",  color: "#f59e0b" },
  "rechazado":  { label: "❌ Rechazado",  color: "#ef4444" },
};

function scoreClass(val) {
  if (!val) return "";
  if (val >= 7.5) return "iv-score-high";
  if (val >= 6) return "iv-score-mid";
  return "iv-score-low";
}
function makeScoreCell(val) {
  const span = document.createElement("span");
  span.className = `iv-score ${scoreClass(val)}`;
  span.textContent = val != null ? val : "—";
  return span;
}
function makeStatusSelect(page) {
  const file = app.vault.getAbstractFileByPath(page.file.path);
  const select = document.createElement("select");
  select.className = "iv-status-select";
  const statuses = ["en_proceso", "aprobado", "en_espera", "rechazado"];
  statuses.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = statusLabels[s].label;
    if (page.resultado === s) opt.selected = true;
    select.appendChild(opt);
  });
  function applyColor() {
    const info = statusLabels[select.value] || { color: "#888" };
    select.style.background = info.color + "33";
    select.style.color = info.color;
    select.style.border = `1px solid ${info.color}66`;
  }
  applyColor();
  select.addEventListener("change", async () => {
    await app.fileManager.processFrontMatter(file, fm => { fm.resultado = select.value; });
    applyColor();
  });
  return select;
}

const allPages = dv.pages('"Interviews"').where(p => p.tipo === "entrevista");
const grupos = {};
for (const p of allPages) {
  const key = `${p.empresa || "Sin Cliente"} — ${p.puesto || "Sin Stack"}`;
  if (!grupos[key]) grupos[key] = [];
  grupos[key].push(p);
}

const container = this.container;

for (const [grupo, pages] of Object.entries(grupos).sort()) {
  const h3 = document.createElement("h3");
  h3.textContent = "🔷 " + grupo;
  h3.style.cssText = "margin-top: 1.5em; margin-bottom: 0.5em; font-size: 1em; color: var(--text-accent);";
  container.appendChild(h3);

  const sorted = pages.sort((a, b) => (b.puntaje_tecnico || 0) - (a.puntaje_tecnico || 0));
  const table = document.createElement("table");
  table.className = "iv-table";

  const hrow = table.createTHead().insertRow();
  ["Candidato", "🧠 Técnico", "🌐 Inglés", "Estado"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    hrow.appendChild(th);
  });

  const tbody = table.createTBody();
  for (const page of sorted) {
    const tr = tbody.insertRow();

    const tdName = tr.insertCell();
    const link = document.createElement("a");
    link.textContent = page.candidato || page.file.name;
    link.className = "internal-link";
    link.onclick = (e) => { e.preventDefault(); app.workspace.openLinkText(page.file.path, '', false); };
    tdName.appendChild(link);

    tr.insertCell().appendChild(makeScoreCell(page.puntaje_tecnico));
    tr.insertCell().appendChild(makeScoreCell(page.puntaje_ingles));
    tr.insertCell().appendChild(makeStatusSelect(page));
  }

  container.appendChild(table);
}
```

---

## 💡 Cómo usar este sistema

1. **Nueva entrevista:** Usa la plantilla en `Plantillas/Plantilla de Entrevista.md`.
2. **Estructura de carpetas:** `Interviews/[Cliente]/[Stack]/[Nombre Candidato].md`
3. **Cambiar estado:** Haz clic directamente en el dropdown de la columna **Estado** — se guarda automáticamente.
4. **Colores de estado:**
   - 🔵 **En Proceso** — Entrevista realizada, pendiente de decisión
   - ✅ **Aprobado** — Pasa a siguiente fase
   - 🟡 **En Espera** — Candidato de backup
   - 🔴 **Rechazado** — No cumple requerimientos
