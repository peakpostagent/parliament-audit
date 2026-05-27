# Monitor-off — turn off the displays without locking the workstation.
#
# Use this instead of Win+L (which both locks the workstation AND
# powers off the screens after a delay). Locking the workstation can
# interfere with browser-automation, Playwright sessions, and some
# scheduled-task contexts; monitor-off has no such side effects.
#
# Implementation: the Win32 SendMessage API broadcasts a system command
# (SC_MONITORPOWER) with lParam=2 (power-off). The monitors wake on
# next keyboard / mouse activity, no login prompt.
#
# Bind to a hotkey by creating a desktop shortcut to scripts/utilities/
# monitor-off.cmd and setting its "Shortcut key" field (e.g. Ctrl+Alt+L).

Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class MonitorOff {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr SendMessage(IntPtr hWnd, int Msg, IntPtr wParam, IntPtr lParam);
}
"@

# HWND_BROADCAST = 0xFFFF, WM_SYSCOMMAND = 0x112, SC_MONITORPOWER = 0xF170, MONITOR_OFF = 2
$null = [MonitorOff]::SendMessage(
    [IntPtr]::new(0xFFFF),
    0x112,
    [IntPtr]::new(0xF170),
    [IntPtr]::new(2)
)
