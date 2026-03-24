# Скрипт для резервного копирования базы данных в Google Drive
# Использование: .\scripts\backup-db.ps1

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$sourceDb = "..\data\sqlite.db"
$backupDir = "$env:USERPROFILE\Google Drive\muammo-app-backup"
$backupFile = "$backupDir\sqlite-backup-$timestamp.db"

# Проверяем существование исходной базы данных
if (-not (Test-Path $sourceDb)) {
    Write-Host "Ошибка: Файл базы данных не найден: $sourceDb"
    exit 1
}

# Создаем папку для бэкапов, если она не существует
if (-not (Test-Path $backupDir)) {
    Write-Host "Создание папки для бэкапов: $backupDir"
    New-Item -ItemType Directory -Path $backupDir -Force
}

# Копируем базу данных
try {
    Copy-Item $sourceDb $backupFile
    Write-Host "База данных успешно скопирована в: $backupFile"
    
    # Удаляем старые бэкапы (оставляем последние 5)
    $backups = Get-ChildItem -Path $backupDir -Filter "sqlite-backup-*.db" | Sort-Object LastWriteTime -Descending
    if ($backups.Count -gt 5) {
        $backups | Select-Object -Skip 5 | Remove-Item -Force
        Write-Host "Удалены старые бэкапы (оставлено последние 5)"
    }
} catch {
    Write-Host "Ошибка при копировании базы данных: $_"
    exit 1
}

Write-Host "Резервное копирование завершено успешно!"
