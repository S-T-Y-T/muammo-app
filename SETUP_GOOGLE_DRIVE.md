# Настройка синхронизации базы данных с Google Drive

## Что сделано

База данных теперь сохраняется в папке `data/sqlite.db` в корне проекта.

## Как настроить синхронизацию с Google Drive

### Вариант 1: Google Drive Desktop (рекомендуется)

1. **Установите Google Drive Desktop:**
   - Скачайте с https://www.google.com/drive/download/
   - Установите приложение

2. **Создайте папку для синхронизации:**
   - Откройте Google Drive в браузере
   - Создайте новую папку, например `muammo-app-backup`

3. **Настройте синхронизацию:**
   - В Google Drive Desktop нажмите на иконку настроек
   - Выберите "Preferences" → "Google Drive" → "Add folder"
   - Выберите созданную папку `muammo-app-backup`

4. **Переместите базу данных:**
   - Скопируйте файл `data/sqlite.db` в папку Google Drive
   - Обновите переменную окружения `DATABASE_URL`

### Вариант 2: Перемещение базы данных напрямую

1. **Переместите базу данных:**
   ```bash
   mv data/sqlite.db "C:\Users\user\Google Drive\muammo-app-backup\sqlite.db"
   ```

2. **Обновите путь в настройках:**
   - Установите переменную окружения:
   ```bash
   DATABASE_URL="file:C:\Users\user\Google Drive\muammo-app-backup\sqlite.db"
   ```

### Вариант 3: Автоматическое резервное копирование

Создайте скрипт для автоматического копирования базы данных:

```bash
# Создайте файл scripts/backup-db.sh
#!/bin/bash
cp data/sqlite.db "C:\Users\user\Google Drive\muammo-app-backup\sqlite-$(date +%Y%m%d-%H%M%S).db"
```

## Переменная окружения

Для использования базы данных в Google Drive установите переменную окружения:

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL = "file:C:\Users\user\Google Drive\muammo-app-backup\sqlite.db"
```

**Windows (CMD):**
```cmd
set DATABASE_URL=file:C:\Users\user\Google Drive\muammo-app-backup\sqlite.db
```

## Важные замечания

- База данных SQLite не предназначена для одновременной работы из нескольких мест
- Убедитесь, что приложение закрыто перед синхронизацией
- Рекомендуется делать резервные копии перед важными изменениями
- Для продакшена рассмотрите использование облачной базы данных (PostgreSQL, MySQL)

## Альтернатива: Облачная база данных

Для более надежного решения рассмотрите:
- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- Neon (PostgreSQL)
- Railway (PostgreSQL)
