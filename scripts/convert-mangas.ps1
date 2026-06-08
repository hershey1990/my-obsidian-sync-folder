$inputFile = Join-Path -Path $PSScriptRoot -ChildPath "..\Mangas\mangas.md"
$outputDir = Join-Path -Path $PSScriptRoot -ChildPath "..\Mangas"

Write-Host "Leyendo $inputFile ..."
$lines = Get-Content -LiteralPath $inputFile
Write-Host "Total lineas: $($lines.Count)"

$count = 0
$errors = @()
$seenNames = @{}

for ($i = 2; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    if ([string]::IsNullOrWhiteSpace($line) -or !$line.StartsWith("|")) { continue }

    $parts = $line.Split('|') | ForEach-Object { $_.Trim() }
    if ($parts.Count -lt 5) { continue }

    $name = if ($parts[1]) { $parts[1] } else { "" }
    if ([string]::IsNullOrWhiteSpace($name)) { continue }

    $chapter = if ($parts[2]) { $parts[2] } else { "1" }
    $status = if ($parts[3]) { $parts[3] } else { "Pendiente" }
    $url = if ($parts[4]) { $parts[4] } else { "" }

    $hasImageCol = $parts.Count -ge 8
    if ($hasImageCol) {
        $image = if ($parts[5]) { $parts[5] } else { "" }
        $notes = if ($parts[6]) { $parts[6] } else { "" }
    } else {
        $image = ""
        $notes = if ($parts[5]) { $parts[5] } else { "" }
    }

    $sanitized = $name -replace '[<>:"/\\|?*]', '_' -replace '\s+', ' ' -replace '\.$', ''
    if ($sanitized.Length -gt 200) { $sanitized = $sanitized.Substring(0, 200).Trim() }
    if ([string]::IsNullOrWhiteSpace($sanitized)) { $sanitized = "manga_$i" }

    $baseName = $sanitized.Trim()
    if ($seenNames.ContainsKey($baseName.ToLower())) {
        $baseName = "$baseName $i"
    } else {
        $seenNames[$baseName.ToLower()] = $true
    }

    $filePath = Join-Path -Path $outputDir -ChildPath "$baseName.md"

    $chapterEscaped = $chapter -replace '"', '\"'
    $notesEscaped = $notes -replace '"', '\"'
    $urlEscaped = $url -replace '"', '\"'
    $imageEscaped = $image -replace '"', '\"'

    $content = "---`n"
    $content += "chapter: $chapterEscaped`n"
    $content += "status: $status`n"
    $content += "url: `"$urlEscaped`"`n"
    $content += "image: `"$imageEscaped`"`n"
    $content += "notes: `"$notesEscaped`"`n"
    $content += "tags: [manga]`n"
    $content += "---`n"
    $content += "`n"
    $content += "# $name`n"

    try {
        Set-Content -LiteralPath $filePath -Value $content -Encoding UTF8 -NoNewline:$false
        $count++
        if ($count % 100 -eq 0) { Write-Host "  ... $count archivos creados" }
    } catch {
        $errors += "$($name): $_"
    }
}

Write-Host "`nCompletado! $count archivos creados en $outputDir"
if ($errors.Count -gt 0) {
    Write-Host "Errores ($($errors.Count)):"
    $errors | ForEach-Object { Write-Host "  - $_" }
}
