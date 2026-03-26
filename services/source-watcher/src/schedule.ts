/**
 * Cron schedule definitions for source polling.
 *
 * During sitting days:
 *   House votes: every 15 minutes between 10:00-22:00 ET
 *   LEGISinfo: every 2 hours
 *
 * Non-sitting days:
 *   House votes: once per hour (catch corrections)
 *   LEGISinfo: every 6 hours
 */

import cron from 'node-cron';
import { pollHouseVotes } from './watchers/house-votes.js';

/**
 * Start all polling schedules.
 */
export function startSchedules(): void {
  console.log('[scheduler] Starting source polling schedules...');

  // House votes — every 15 minutes during expected sitting hours
  // Cron: At minute 0, 15, 30, 45 past every hour from 10 to 22
  cron.schedule('*/15 10-22 * * 1-5', async () => {
    try {
      await pollHouseVotes();
    } catch (err) {
      console.error('[scheduler] House vote poll failed:', err);
    }
  }, {
    timezone: 'America/Toronto',
  });

  // House votes — hourly fallback (weekends + off-hours for corrections)
  cron.schedule('0 * * * 0,6', async () => {
    try {
      await pollHouseVotes();
    } catch (err) {
      console.error('[scheduler] House vote fallback poll failed:', err);
    }
  }, {
    timezone: 'America/Toronto',
  });

  console.log('[scheduler] Schedules started:');
  console.log('  - House votes: every 15 min (Mon-Fri 10:00-22:00 ET)');
  console.log('  - House votes fallback: hourly (weekends)');
}

/**
 * Run an immediate poll of all sources (for manual testing / startup).
 */
export async function pollAllNow(): Promise<void> {
  console.log('[scheduler] Running immediate poll of all sources...');

  try {
    const houseResult = await pollHouseVotes();
    console.log(`[scheduler] House: ${houseResult.newVotes} new / ${houseResult.totalVotes} total`);
  } catch (err) {
    console.error('[scheduler] Immediate house poll failed:', err);
  }
}
