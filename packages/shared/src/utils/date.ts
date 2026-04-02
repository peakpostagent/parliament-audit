/**
 * Date utilities for Parliament Audit.
 * All dates are handled in Eastern Time (Ottawa) by default.
 */

const EASTERN_TZ = 'America/Toronto';

export function formatDateET(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-CA', {
    timeZone: EASTERN_TZ,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTimeET(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-CA', {
    timeZone: EASTERN_TZ,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isParliamentSittingHours(): boolean {
  const now = new Date();
  const etHour = parseInt(
    now.toLocaleString('en-US', { timeZone: EASTERN_TZ, hour: 'numeric', hour12: false })
  );
  return etHour >= 10 && etHour <= 22;
}

export function getParliamentSession(parliament: number, session: number): string {
  return `${parliament}-${session}`;
}
