@echo off
set DB_NAME=financetracker
set DB_USER=root
set DB_PASS=DontForget123
set BACKUP_DIR=db_backups
set DATE=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%_%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%
mysqldump -u %DB_USER% -p%DB_PASS% %DB_NAME% > %BACKUP_DIR%\%DB_NAME%_backup_%DATE%.sql
echo Backup completed: %BACKUP_DIR%\%DB_NAME%_backup_%DATE%.sql