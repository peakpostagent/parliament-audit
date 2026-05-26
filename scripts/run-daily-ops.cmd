@echo off
REM Parliament Audit ? daily-ops wrapper for Windows Task Scheduler.
REM
REM Replaces the previous Claude Code scheduled-task setup (which only
REM fired when Claude Code itself was running ? failed silently when the
REM app crashed or wasn't open). This is a pure Windows scheduled task
REM that runs independently of Claude Code.
REM
REM Schedule: 5:03 AM and 1:03 PM local time, daily.
REM Logs:    content\daily-ops\.task-run-<YYYYMMDD>.log
REM
REM Set up via scripts\setup-daily-ops-scheduled-task.ps1.

set "REPO=C:\Users\colet\Documents\Social Media\parliament-audit"
set "LOGDIR=%REPO%\content\daily-ops"
set "NPX=C:\Program Files\nodejs\npx.cmd"

REM Locale-independent YYYYMMDD / HHMMSS via PowerShell (cmd's wmic+substring
REM trick is brittle across Windows builds ? PowerShell's Get-Date is reliable
REM and present on every supported Windows version).
for /f "usebackq tokens=*" %%T in (`powershell -NoProfile -Command "Get-Date -Format yyyyMMdd"`) do set "DATE_TAG=%%T"
for /f "usebackq tokens=*" %%T in (`powershell -NoProfile -Command "Get-Date -Format HHmmss"`) do set "TIME_TAG=%%T"

if not exist "%LOGDIR%" mkdir "%LOGDIR%"

set "LOG=%LOGDIR%\.task-run-%DATE_TAG%.log"

REM Append a header so multi-run-per-day logs are readable.
>>"%LOG%" echo.
>>"%LOG%" echo === run %DATE_TAG% %TIME_TAG% ===
>>"%LOG%" echo cwd: %REPO%

cd /d "%REPO%" || (
  >>"%LOG%" echo ERROR: cannot cd to repo
  exit /b 2
)

REM Run daily-ops, appending stdout+stderr to the day's log.
"%NPX%" tsx scripts/daily-ops.ts >>"%LOG%" 2>&1
set "RC=%ERRORLEVEL%"

>>"%LOG%" echo === exit %RC% ===
exit /b %RC%
