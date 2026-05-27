@echo off
REM Monitor-off ? call this from a desktop shortcut or hotkey.
REM
REM Turns the monitors off without locking the workstation. See
REM monitor-off.ps1 for full notes on why this is preferable to Win+L
REM for an autonomous workflow.
REM
REM This .cmd exists because desktop shortcuts and Windows Run dialog
REM call .cmd / .exe more cleanly than .ps1 directly (no ExecutionPolicy
REM prompts, no PowerShell window flash with the right flags).

powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0monitor-off.ps1"
