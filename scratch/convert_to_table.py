import re
import os
import shutil

# Paths
vault_path = r"c:\Obsidian Vault\Surface Vault"
mangas_md_path = os.path.join(vault_path, "mangas.md")
backup_md_path = os.path.join(vault_path, "mangas.backup.md")

def convert():
    if not os.path.exists(mangas_md_path):
        print(f"Error: No se encontró el archivo '{mangas_md_path}'")
        return

    # 1. Back up original mangas.md
    print(f"Creando respaldo en: {backup_md_path}")
    shutil.copy2(mangas_md_path, backup_md_path)

    # 2. Read contents
    with open(mangas_md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    parsed_mangas = []

    for line_num, line in enumerate(lines, 1):
        clean_line = line.strip()
        if not clean_line:
            continue
        
        # 2a. Determine status
        status = "Pendiente"
        if re.search(r"[-–—\s]\s*(final|fin|finalizado)\s*$", clean_line, re.IGNORECASE):
            status = "Finalizado"
        elif re.search(r"[-–—\s]\s*(leyendo)\s*$", clean_line, re.IGNORECASE):
            status = "Leyendo"
        elif re.search(r"[-–—\s]\s*(leer|volver a leer)\s*$", clean_line, re.IGNORECASE):
            status = "Por leer"
        # Check if mentioned anywhere in a dash comment
        elif " - leyendo" in clean_line.lower() or " -- leyendo" in clean_line.lower():
            status = "Leyendo"
        elif " - final" in clean_line.lower() or " -- final" in clean_line.lower():
            status = "Finalizado"

        # 2b. Extract URL
        url_match = re.search(r"https?://\S+", clean_line)
        url = url_match.group(0) if url_match else ""
        
        # Clean string for name/number extraction
        working_str = clean_line
        if url:
            working_str = working_str.replace(url, "")
            working_str = re.sub(r"\(\s*\)", "", working_str)
            working_str = re.sub(r"\[\s*\]", "", working_str)

        # Strip specific suffixes only at the end of the line
        working_str = re.sub(r"\s*[-–—]+\s*(leyendo|final|leer|volver a leer|fin|fin final)\s*$", "", working_str, flags=re.IGNORECASE)
        working_str = re.sub(r"\s+\b(final|fin|leyendo|leer|volver a leer|fin final)\b\s*$", "", working_str, flags=re.IGNORECASE)
        
        # Extract notes from parenthetical comments
        notes_match = re.search(r"\((volver a leer|ya lei alguno.*?)\)", working_str, flags=re.IGNORECASE)
        notes = notes_match.group(1).strip() if notes_match else ""
        
        # Clean up parenthetical comments and trailing dashes
        working_str = re.sub(r"\s*\((volver a leer|ya lei alguno.*?|http.*?)\)", "", working_str, flags=re.IGNORECASE)
        working_str = re.sub(r"\s*[-–—]+$", "", working_str).strip()

        # 2c. Match name and number
        match = re.search(r"^(.*?)\s+([\d\.\?]+)(.*)$", working_str)
        if not match:
            # Try without space, e.g. "Caterpillar1"
            match = re.search(r"^(.*?)(\d+)$", working_str)
            
        if match:
            name = match.group(1).strip()
            number = match.group(2).strip()
            # Append trailing extra text to notes if any
            extra = match.group(3).strip() if len(match.groups()) > 2 else ""
            if extra:
                notes = f"{notes} {extra}".strip()
        else:
            name = working_str
            number = "?"

        # Clean name
        name = re.sub(r"\s*[-–—]+$", "", name).strip()
        
        parsed_mangas.append({
            "name": name,
            "number": number,
            "status": status,
            "url": url,
            "notes": notes
        })

    # 3. Format as Markdown table
    table_lines = [
        "| Manga | Capítulo | Estado | URL | Notas |",
        "| --- | --- | --- | --- | --- |"
    ]
    for m in parsed_mangas:
        # Escape pipe symbols in names just in case
        esc_name = m['name'].replace("|", "\\|")
        esc_notes = m['notes'].replace("|", "\\|")
        row = f"| {esc_name} | {m['number']} | {m['status']} | {m['url']} | {esc_notes} |"
        table_lines.append(row)

    # 4. Write back to mangas.md
    print(f"Escribiendo la tabla Markdown en: {mangas_md_path}")
    with open(mangas_md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(table_lines) + "\n")

    print(f"Conversión completada con éxito. Se procesaron {len(parsed_mangas)} mangas.")
    return len(parsed_mangas)

if __name__ == "__main__":
    convert()
