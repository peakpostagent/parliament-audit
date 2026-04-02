/**
 * Source Watcher Service — Entry Point
 *
 * Starts polling schedules for all parliamentary data sources.
 * On startup, runs an immediate poll to catch any votes missed while offline.
 */

import { startSchedules, pollAllNow } from './schedule.js';

async function main(): Promise<void> {
  console.log('════════════════════════════════════════════');
  console.log('  Parliament Audit — Source Watcher');
  console.log('  Canada deserves to know.');
  console.log('════════════════════════════════════════════');
  console.log();

  // Run an immediate poll on startup
  await pollAllNow();

  // Start scheduled polling
  startSchedules();

  console.log();
  console.log('[source-watcher] Service running. Waiting for next poll...');
}

main().catch((err) => {
  console.error('[source-watcher] Fatal error:', err);
  process.exit(1);
});
