# Tracker de Mangas

```dataviewjs
// 1. Obtener y configurar el archivo de datos
const dataFilePath = "mangas/mangas.md";
const file = app.vault.getAbstractFileByPath(dataFilePath);

if (!file) {
    dv.paragraph("⚠️ **Error**: No se encontró el archivo `mangas.md` en la ruta `mangas/mangas.md`. Por favor asegúrate de que exista en esa carpeta.");
    return;
}

// Inyectar Estilos CSS Personalizados
const styleId = "manga-tracker-styles";
let styleEl = document.getElementById(styleId);
if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.innerHTML = `
        .manga-tracker-container {
            font-family: var(--font-interface), sans-serif;
            color: var(--text-normal);
            background: var(--background-secondary-alt);
            border-radius: 12px;
            padding: 20px;
            border: 1px solid var(--background-modifier-border);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            margin-top: 10px;
        }

        /* Grid de estadísticas */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .stat-card {
            background: var(--background-primary);
            border-radius: 8px;
            padding: 15px;
            border: 1px solid var(--background-modifier-border);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            border-color: var(--text-accent);
        }

        .stat-val {
            font-size: 26px;
            font-weight: 700;
            margin-top: 5px;
            color: var(--text-accent);
        }

        .stat-lbl {
            font-size: 11px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        /* Barra de progreso global */
        .progress-section {
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-normal);
            margin-bottom: 6px;
        }

        .progress-bar-bg {
            background: var(--background-secondary);
            border-radius: 10px;
            height: 10px;
            overflow: hidden;
            border: 1px solid var(--background-modifier-border);
        }

        .progress-bar-fill {
            background: linear-gradient(90deg, var(--text-accent), #06b6d4);
            height: 100%;
            border-radius: 10px;
            transition: width 0.4s ease;
        }

        /* Barra de control (búsqueda y filtros) */
        .controls-bar {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;
            align-items: center;
        }

        .search-input-wrapper {
            flex: 1;
            min-width: 220px;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-normal);
            font-size: 14px;
        }

        .search-input:focus {
            border-color: var(--text-accent);
            outline: none;
            box-shadow: 0 0 0 2px rgba(var(--text-accent-rgb), 0.2);
        }

        .filter-buttons {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-muted);
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 500;
        }

        .filter-btn.active {
            background: var(--text-accent);
            color: #fff;
            border-color: var(--text-accent);
        }

        .filter-btn:hover:not(.active) {
            background: var(--background-secondary);
            color: var(--text-normal);
        }

        .add-btn-toggle {
            background: #059669;
            color: #fff;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            transition: background 0.2s ease;
        }

        .add-btn-toggle:hover {
            background: #047857;
        }

        /* Formulario para agregar */
        .form-container {
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            display: none;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 12px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-size: 11px;
            color: var(--text-muted);
            margin-bottom: 4px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .form-group input, .form-group select {
            padding: 8px 10px;
            border-radius: 6px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-secondary);
            color: var(--text-normal);
            font-size: 13px;
        }

        .form-group input:focus, .form-group select:focus {
            border-color: var(--text-accent);
            outline: none;
        }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .form-actions button {
            padding: 8px 14px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
        }

        .btn-submit {
            background: var(--text-accent);
            color: white;
            border: none;
        }

        .btn-submit:hover {
            opacity: 0.9;
        }

        .btn-cancel {
            background: transparent;
            border: 1px solid var(--background-modifier-border);
            color: var(--text-normal);
        }

        .btn-cancel:hover {
            background: var(--background-secondary);
        }

        /* Tabla de Mangas */
        .manga-table-wrapper {
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 8px;
            overflow-x: auto;
        }

        .manga-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13.5px;
        }

        .manga-table th, .manga-table td {
            padding: 12px 14px;
            text-align: left;
            border-bottom: 1px solid var(--background-modifier-border);
        }

        .manga-table th {
            font-weight: 600;
            color: var(--text-muted);
            background: var(--background-secondary-alt);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .manga-row:hover {
            background: rgba(var(--text-accent-rgb), 0.02);
        }

        .manga-name-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .manga-name {
            font-weight: 600;
            color: var(--text-normal);
        }

        .manga-link {
            color: var(--text-accent);
            opacity: 0.6;
            text-decoration: none;
            font-size: 14px;
        }

        .manga-link:hover {
            opacity: 1;
        }

        .manga-notes {
            font-size: 12px;
            color: var(--text-muted);
            font-style: italic;
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .chapter-control {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .chap-btn {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-secondary);
            color: var(--text-normal);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.15s ease;
        }

        .chap-btn:hover {
            background: var(--text-accent);
            color: white;
            border-color: var(--text-accent);
        }

        .chap-val {
            min-width: 26px;
            text-align: center;
            font-weight: 700;
            font-size: 14px;
        }

        .status-dropdown {
            padding: 5px 8px;
            border-radius: 6px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-normal);
            font-size: 12.5px;
            cursor: pointer;
            font-weight: 500;
        }

        .status-dropdown.leyendo {
            color: #3b82f6;
            font-weight: 600;
        }
        .status-dropdown.finalizado {
            color: #10b981;
            font-weight: 600;
        }
        .status-dropdown.por-leer {
            color: #f59e0b;
            font-weight: 600;
        }
        .status-dropdown.pendiente {
            color: var(--text-muted);
        }

        .btn-complete {
            background: transparent;
            border: 1px solid var(--background-modifier-border);
            border-radius: 6px;
            cursor: pointer;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .btn-complete:hover {
            background: var(--background-secondary);
            color: var(--text-normal);
        }

        .btn-complete.active {
            background: #10b981;
            color: white;
            border-color: #10b981;
        }

        /* Paginación */
        .pagination-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 10px;
        }

        .pagination-btn {
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-normal);
            cursor: pointer;
            font-weight: 500;
            font-size: 13px;
            transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
            background: var(--background-secondary);
        }

        .pagination-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .pagination-info {
            font-size: 13px;
            color: var(--text-muted);
            font-weight: 500;
        }
    `;
    document.head.appendChild(styleEl);
}

// 2. Variables de estado del Dashboard
let mangas = [];
let searchQuery = "";
let statusFilter = "Todos";
let currentPage = 1;
let itemsPerPage = 20;

// Cargar y procesar datos desde mangas.md
async function loadData() {
    try {
        const content = await app.vault.read(file);
        const lines = content.split("\n");
        mangas = [];

        // Saltamos las dos primeras líneas (encabezado de la tabla | Manga |... y divisor | --- |...)
        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || !line.startsWith("|")) continue;

            const parts = line.split("|").map(p => p.trim());
            // parts[0] = "", parts[1] = Manga, parts[2] = Capítulo, parts[3] = Estado, parts[4] = URL, parts[5] = Notas, parts[6] = ""
            if (parts.length >= 6) {
                mangas.push({
                    name: parts[1],
                    chapter: parts[2],
                    status: parts[3] || "Pendiente",
                    url: parts[4] || "",
                    notes: parts[5] || ""
                });
            }
        }
    } catch (e) {
        console.error("Error al leer mangas.md", e);
    }
}

// Guardar los datos en mangas.md
async function saveData() {
    try {
        let tableHeader = "| Manga | Capítulo | Estado | URL | Notas |\n| --- | --- | --- | --- | --- |";
        let rows = mangas.map(m => `| ${m.name} | ${m.chapter} | ${m.status} | ${m.url} | ${m.notes} |`);
        let newContent = [tableHeader, ...rows].join("\n") + "\n";
        await app.vault.modify(file, newContent);
    } catch (e) {
        console.error("Error al escribir en mangas.md", e);
    }
}

// 3. Crear Estructura DOM de la Interfaz
const trackerContainer = dv.container.createEl("div", { cls: "manga-tracker-container" });

// Crear sección de estadísticas
const statsSection = trackerContainer.createEl("div");

// Crear barra de progreso
const progressSection = trackerContainer.createEl("div", { cls: "progress-section" });

// Crear barra de controles
const controlsBar = trackerContainer.createEl("div", { cls: "controls-bar" });

// Buscador
const searchWrapper = controlsBar.createEl("div", { cls: "search-input-wrapper" });
const searchInput = searchWrapper.createEl("input", {
    type: "text",
    cls: "search-input",
    placeholder: "Buscar manga por nombre..."
});

// Selector de ítems por página (Paginación)
const limitWrapper = controlsBar.createEl("div", { cls: "limit-wrapper", style: "display: flex; align-items: center; gap: 6px;" });
limitWrapper.createEl("span", { text: "Mostrar:", style: "font-size: 13px; color: var(--text-muted); font-weight: 600;" });
const limitSelect = limitWrapper.createEl("select", {
    cls: "status-dropdown",
    style: "padding: 6px 10px; font-size: 13px; font-weight: 600;"
});
[10, 20, 50, 100].forEach(num => {
    const opt = limitSelect.createEl("option", { value: num.toString(), text: `${num} por pág.` });
    if (num === itemsPerPage) opt.selected = true;
});
limitSelect.addEventListener("change", (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    render();
});

// Filtros de estado
const filterWrapper = controlsBar.createEl("div", { cls: "filter-buttons" });
const statuses = ["Todos", "Leyendo", "Finalizado", "Por leer", "Pendiente"];
const filterButtons = {};

statuses.forEach(status => {
    const btn = filterWrapper.createEl("button", {
        cls: `filter-btn ${status === statusFilter ? 'active' : ''}`,
        text: status
    });
    filterButtons[status] = btn;
    btn.addEventListener("click", () => {
        Object.values(filterButtons).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        statusFilter = status;
        currentPage = 1;
        render();
    });
});

// Botón para expandir formulario de agregar
const addToggleBtn = controlsBar.createEl("button", {
    cls: "add-btn-toggle",
    text: "+ Agregar Manga"
});

// Formulario para añadir mangas
const formContainer = trackerContainer.createEl("div", { cls: "form-container" });
formContainer.innerHTML = `
    <div class="form-grid">
        <div class="form-group">
            <label>Nombre del Manga</label>
            <input type="text" id="new-manga-name" placeholder="Ej. Naruto">
        </div>
        <div class="form-group">
            <label>Capítulo / Tomo</label>
            <input type="text" id="new-manga-chapter" value="1">
        </div>
        <div class="form-group">
            <label>Estado</label>
            <select id="new-manga-status">
                <option value="Pendiente">Pendiente</option>
                <option value="Leyendo">Leyendo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Por leer">Por leer</option>
            </select>
        </div>
        <div class="form-group">
            <label>URL (Enlace)</label>
            <input type="text" id="new-manga-url" placeholder="http://...">
        </div>
        <div class="form-group">
            <label>Notas</label>
            <input type="text" id="new-manga-notes" placeholder="Notas...">
        </div>
    </div>
    <div class="form-actions">
        <button class="btn-cancel" id="btn-form-cancel">Cancelar</button>
        <button class="btn-submit" id="btn-form-submit">Guardar</button>
    </div>
`;

// Mostrar/Ocultar Formulario
addToggleBtn.addEventListener("click", () => {
    const isVisible = formContainer.style.display === "block";
    formContainer.style.display = isVisible ? "none" : "block";
});

formContainer.querySelector("#btn-form-cancel").addEventListener("click", () => {
    formContainer.style.display = "none";
    clearForm();
});

formContainer.querySelector("#btn-form-submit").addEventListener("click", async () => {
    const nameInput = formContainer.querySelector("#new-manga-name");
    const name = nameInput.value.trim();
    if (!name) {
        alert("El nombre del manga es requerido.");
        return;
    }

    const chapter = formContainer.querySelector("#new-manga-chapter").value.trim() || "1";
    const status = formContainer.querySelector("#new-manga-status").value;
    const url = formContainer.querySelector("#new-manga-url").value.trim();
    const notes = formContainer.querySelector("#new-manga-notes").value.trim();

    // Añadir al inicio de la lista
    mangas.unshift({ name, chapter, status, url, notes });
    
    await saveData();
    formContainer.style.display = "none";
    clearForm();
    render();
});

function clearForm() {
    formContainer.querySelector("#new-manga-name").value = "";
    formContainer.querySelector("#new-manga-chapter").value = "1";
    formContainer.querySelector("#new-manga-status").value = "Pendiente";
    formContainer.querySelector("#new-manga-url").value = "";
    formContainer.querySelector("#new-manga-notes").value = "";
}

// Contenedor de la Tabla de Mangas
const tableWrapper = trackerContainer.createEl("div", { cls: "manga-table-wrapper" });
const table = tableWrapper.createEl("table", { cls: "manga-table" });

// Paginación
const paginationBar = trackerContainer.createEl("div", { cls: "pagination-bar" });

// Búsqueda en tiempo real
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    currentPage = 1;
    render();
});

// 4. Renderizado Dinámico
function render() {
    // 4a. Filtrado de mangas en memoria
    let filtered = mangas;
    
    if (searchQuery) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(searchQuery));
    }
    
    if (statusFilter !== "Todos") {
        filtered = filtered.filter(m => m.status === statusFilter);
    }

    // 4b. Calcular estadísticas generales (en base al total completo)
    const totalCount = mangas.length;
    const completedCount = mangas.filter(m => m.status === "Finalizado").length;
    const readingCount = mangas.filter(m => m.status === "Leyendo").length;
    const toReadCount = mangas.filter(m => m.status === "Por leer").length;
    const pendingCount = mangas.filter(m => m.status === "Pendiente").length;
    
    const percentage = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0;

    // Actualizar sección de estadísticas
    statsSection.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-lbl">Total Mangas</span>
                <span class="stat-val">${totalCount}</span>
            </div>
            <div class="stat-card">
                <span class="stat-lbl">Leyendo</span>
                <span class="stat-val" style="color: #3b82f6;">${readingCount}</span>
            </div>
            <div class="stat-card">
                <span class="stat-lbl">Finalizados</span>
                <span class="stat-val" style="color: #10b981;">${completedCount}</span>
            </div>
            <div class="stat-card">
                <span class="stat-lbl">Por Leer</span>
                <span class="stat-val" style="color: #f59e0b;">${toReadCount}</span>
            </div>
        </div>
    `;

    // Actualizar barra de progreso
    progressSection.innerHTML = `
        <div class="progress-header">
            <span>Progreso de Lectura General</span>
            <span>${completedCount} / ${totalCount} finalizados (${percentage}%)</span>
        </div>
        <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
    `;

    // 4c. Paginación
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIdx, startIdx + itemsPerPage);

    // 4d. Renderizar Tabla
    let tableHTML = `
        <thead>
            <tr>
                <th style="width: 45%;">Manga</th>
                <th style="width: 20%; text-align: center;">Capítulo</th>
                <th style="width: 20%;">Estado</th>
                <th style="width: 15%; text-align: center;">Acciones</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (paginatedItems.length === 0) {
        tableHTML += `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    Ningún manga coincide con la búsqueda o filtro.
                </td>
            </tr>
        `;
    } else {
        paginatedItems.forEach((m, localIdx) => {
            // Buscamos el índice absoluto en la lista completa para poder modificarlo
            const absoluteIdx = mangas.findIndex(x => x.name === m.name);
            
            const urlIcon = m.url ? `<a class="manga-link" href="${m.url}" target="_blank" title="Abrir enlace">🔗</a>` : "";
            const isCompleted = m.status === "Finalizado";
            const dropdownClass = m.status.toLowerCase().replace(" ", "-");

            tableHTML += `
                <tr class="manga-row" data-idx="${absoluteIdx}">
                    <td>
                        <div class="manga-name-cell">
                            <span class="manga-name">${m.name}</span>
                            ${urlIcon}
                        </div>
                        ${m.notes ? `<div class="manga-notes" title="${m.notes}">${m.notes}</div>` : ""}
                    </td>
                    <td>
                        <div class="chapter-control" style="justify-content: center;">
                            <button class="chap-btn btn-dec" data-idx="${absoluteIdx}">-</button>
                            <span class="chap-val">${m.chapter}</span>
                            <button class="chap-btn btn-inc" data-idx="${absoluteIdx}">+</button>
                        </div>
                    </td>
                    <td>
                        <select class="status-dropdown ${dropdownClass}" data-idx="${absoluteIdx}">
                            <option value="Pendiente" ${m.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            <option value="Leyendo" ${m.status === 'Leyendo' ? 'selected' : ''}>Leyendo</option>
                            <option value="Finalizado" ${m.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                            <option value="Por leer" ${m.status === 'Por leer' ? 'selected' : ''}>Por leer</option>
                        </select>
                    </td>
                    <td style="text-align: center;">
                        <button class="btn-complete ${isCompleted ? 'active' : ''}" data-idx="${absoluteIdx}">
                            ${isCompleted ? '✓ Leído' : 'Finalizar'}
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    tableHTML += `</tbody>`;
    table.innerHTML = tableHTML;

    // Vincular eventos a los elementos interactivos recién creados
    bindTableEvents();

    // 4e. Renderizar Barra de Paginación
    paginationBar.innerHTML = `
        <button class="pagination-btn" id="btn-prev" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span class="pagination-info">Página ${currentPage} de ${totalPages} (${filtered.length} total)</span>
        <button class="pagination-btn" id="btn-next" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
    `;

    paginationBar.querySelector("#btn-prev").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            render();
        }
    });

    paginationBar.querySelector("#btn-next").addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            render();
        }
    });
}

// 5. Vincular eventos de la tabla
function bindTableEvents() {
    // Botones de incremento (+)
    table.querySelectorAll(".btn-inc").forEach(btn => {
        btn.addEventListener("click", async () => {
            const idx = parseInt(btn.getAttribute("data-idx"));
            let currentVal = mangas[idx].chapter;
            
            // Intentar parsear número
            let num = parseFloat(currentVal);
            if (!isNaN(num)) {
                mangas[idx].chapter = (num + 1).toString();
            } else {
                mangas[idx].chapter = "1";
            }
            
            // Si estaba en Pendiente, lo pasamos a Leyendo al avanzar capítulo
            if (mangas[idx].status === "Pendiente") {
                mangas[idx].status = "Leyendo";
            }

            // Actualizar localmente e interactuar en segundo plano con el archivo
            renderRowUpdate(idx);
            await saveData();
            renderStatsAndProgressOnly();
        });
    });

    // Botones de decremento (-)
    table.querySelectorAll(".btn-dec").forEach(btn => {
        btn.addEventListener("click", async () => {
            const idx = parseInt(btn.getAttribute("data-idx"));
            let currentVal = mangas[idx].chapter;
            
            let num = parseFloat(currentVal);
            if (!isNaN(num) && num > 0) {
                mangas[idx].chapter = (num - 1).toString();
                
                // Si llega a 0, tal vez poner pendiente
                if (num - 1 === 0 && mangas[idx].status === "Leyendo") {
                    mangas[idx].status = "Pendiente";
                }
                
                renderRowUpdate(idx);
                await saveData();
                renderStatsAndProgressOnly();
            }
        });
    });

    // Selectores de estado
    table.querySelectorAll(".status-dropdown").forEach(select => {
        select.addEventListener("change", async (e) => {
            const idx = parseInt(select.getAttribute("data-idx"));
            const newStatus = e.target.value;
            mangas[idx].status = newStatus;
            
            if (statusFilter !== "Todos") {
                render();
            } else {
                renderRowUpdate(idx);
                renderStatsAndProgressOnly();
            }
            await saveData();
        });
    });

    // Botones rápidos de completar / finalizar
    table.querySelectorAll(".btn-complete").forEach(btn => {
        btn.addEventListener("click", async () => {
            const idx = parseInt(btn.getAttribute("data-idx"));
            const isCompleted = mangas[idx].status === "Finalizado";
            
            if (isCompleted) {
                mangas[idx].status = "Leyendo";
            } else {
                mangas[idx].status = "Finalizado";
            }
            
            if (statusFilter !== "Todos") {
                render();
            } else {
                renderRowUpdate(idx);
                renderStatsAndProgressOnly();
            }
            await saveData();
        });
    });
}

// Helper para actualizar solo una fila visualmente sin redibujar toda la tabla (evita parpadeos y lag)
function renderRowUpdate(absoluteIdx) {
    const row = table.querySelector(`tr[data-idx="${absoluteIdx}"]`);
    if (!row) return;

    const m = mangas[absoluteIdx];
    
    // Actualizar valor de capítulo
    row.querySelector(".chap-val").textContent = m.chapter;
    
    // Actualizar selector de estado
    const select = row.querySelector(".status-dropdown");
    select.value = m.status;
    select.className = `status-dropdown ${m.status.toLowerCase().replace(" ", "-")}`;

    // Actualizar botón de finalizar
    const btn = row.querySelector(".btn-complete");
    if (m.status === "Finalizado") {
        btn.classList.add("active");
        btn.textContent = "✓ Leído";
    } else {
        btn.classList.remove("active");
        btn.textContent = "Finalizar";
    }
}

// Helper para redibujar solo las estadísticas y el progreso (muy rápido)
function renderStatsAndProgressOnly() {
    const totalCount = mangas.length;
    const completedCount = mangas.filter(m => m.status === "Finalizado").length;
    const readingCount = mangas.filter(m => m.status === "Leyendo").length;
    const toReadCount = mangas.filter(m => m.status === "Por leer").length;
    
    const percentage = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0;

    statsSection.querySelector(".stats-grid").innerHTML = `
        <div class="stat-card">
            <span class="stat-lbl">Total Mangas</span>
            <span class="stat-val">${totalCount}</span>
        </div>
        <div class="stat-card">
            <span class="stat-lbl">Leyendo</span>
            <span class="stat-val" style="color: #3b82f6;">${readingCount}</span>
        </div>
        <div class="stat-card">
            <span class="stat-lbl">Finalizados</span>
            <span class="stat-val" style="color: #10b981;">${completedCount}</span>
        </div>
        <div class="stat-card">
            <span class="stat-lbl">Por Leer</span>
            <span class="stat-val" style="color: #f59e0b;">${toReadCount}</span>
        </div>
    `;

    progressSection.innerHTML = `
        <div class="progress-header">
            <span>Progreso de Lectura General</span>
            <span>${completedCount} / ${totalCount} finalizados (${percentage}%)</span>
        </div>
        <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
        </div>
    `;
}

// 6. Carga Inicial y Primer Renderizado
(async () => {
    trackerContainer.createEl("p", { text: "Cargando biblioteca de mangas...", cls: "loading-text" });
    await loadData();
    const loading = trackerContainer.querySelector(".loading-text");
    if (loading) loading.remove();
    render();
})();
```
