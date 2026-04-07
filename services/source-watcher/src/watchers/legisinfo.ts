/**
 * LEGISinfo Bill Metadata Watcher
 *
 * Polls parl.ca/legisinfo for bill metadata (title, status, stage, sponsor).
 * Used to enrich vote records with bill context.
 */

import { PARLIAMENT_URLS } from '@parliament-audit/shared';

const CURRENT_PARLIAMENT = 45;
const CURRENT_SESSION = 1;

export interface BillMetadata {
  billNumber: string;
  title: string;
  titleFr: string;
  type: string;            // 'Government' | 'Private Member' | 'Senate Public'
  sponsor: string | null;
  currentStatus: string;
  lastMajorEvent: string;
  lastEventDate: string;
  legisinfoUrl: string;
}

/**
 * Fetch all bills for the current session from LEGISinfo.
 */
export async function fetchBills(): Promise<BillMetadata[]> {
  const parlSession = `${CURRENT_PARLIAMENT}-${CURRENT_SESSION}`;
  const url = PARLIAMENT_URLS.legisinfoBillsJson(parlSession);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ParliamentAudit/1.0 (civic media; contact@parliamentaudit.ca)',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch LEGISinfo bills: ${response.status}`);
  }

  const data: any = await response.json();

  // LEGISinfo JSON structure — adapt based on actual response shape
  const bills = Array.isArray(data) ? data : data.Bills || data.bills || [];

  return bills.map((bill: any) => ({
    billNumber: bill.NumberCode || bill.BillNumber || '',
    title: bill.LongTitleEn || bill.Title || bill.ShortTitleEn || '',
    titleFr: bill.LongTitleFr || bill.TitleFr || bill.ShortTitleFr || '',
    type: bill.BillType || bill.Type || '',
    sponsor: bill.SponsorPersonName || bill.Sponsor || null,
    currentStatus: bill.StatusNameEn || bill.Status || '',
    lastMajorEvent: bill.LastMajorStageEn || bill.LastEvent || '',
    lastEventDate: bill.LastMajorStageDate || bill.LastEventDate || '',
    legisinfoUrl: PARLIAMENT_URLS.legisinfoBillPage(parlSession, bill.NumberCode || bill.BillNumber || ''),
  }));
}

/**
 * Look up metadata for a specific bill by number.
 */
export async function fetchBillByNumber(billNumber: string): Promise<BillMetadata | null> {
  const bills = await fetchBills();
  const normalized = billNumber.toUpperCase().replace(/\s/g, '');

  return bills.find(b =>
    b.billNumber.toUpperCase().replace(/\s/g, '') === normalized
  ) || null;
}
