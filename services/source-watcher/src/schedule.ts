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
import { fetchBills } from './watchers/legisinfo.js';

// In-memory bill metadata cache, refreshed on each poll
let billCache: Awaited<ReturnType<typeof fetchBills>> = [];

export function getBillCache() {
  return billCache;
}

async function pollLegisinfo(): Promise<void> {
  console.log('[scheduler] Polling LEGISinfo for bill metadata...');
  try {
    billCache = await fetchBills();
    console.log(`[scheduler] LEGISinfo: cached ${billCache.length} bills`);
  } catch (err) {
    console.error('[scheduler] LEGISinfo poll failed:', err);
  }
}

/**
 * Start all polling schedules.
 */
export function startSchedules(): void {
  console.log('[scheduler] Starting source polling schedules...');

  // House votes — every 15 minutes during expected sitting hours
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

  // LEGISinfo — every 2 hours during sitting days
  cron.schedule('0 */2 * * 1-5', async () => {
    await pollLegisinfo();
  }, {
    timezone: 'America/Toronto',
  });

  // LEGISinfo — every 6 hours on weekends
  cron.schedule('0 */6 * * 0,6', async () => {
    await pollLegisinfo();
  }, {
    timezone: 'America/Toronto',
  });

  console.log('[scheduler] Schedules started:');
  console.log('  - House votes: every 15 min (Mon-Fri 10:00-22:00 ET)');
  console.log('  - House votes fallback: hourly (weekends)');
  console.log('  - LEGISinfo: every 2h (weekdays), every 6h (weekends)');
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

  await pollLegisinfo();
}
