/**
 * Canadian political party constants.
 */

export const PARTY_SHORT_NAMES: Record<string, string> = {
  LPC: 'Liberal',
  CPC: 'Conservative',
  NDP: 'NDP',
  BQ: 'Bloc Québécois',
  GPC: 'Green',
  IND: 'Independent',
};

export const PARTY_FULL_NAMES: Record<string, string> = {
  LPC: 'Liberal Party of Canada',
  CPC: 'Conservative Party of Canada',
  NDP: 'New Democratic Party',
  BQ: 'Bloc Québécois',
  GPC: 'Green Party of Canada',
  IND: 'Independent',
};

export const PARTY_COLORS: Record<string, string> = {
  LPC: '#D71920',
  CPC: '#1A4782',
  NDP: '#F58220',
  BQ: '#33B2CC',
  GPC: '#3D9B35',
  IND: '#888888',
};

/**
 * Map XML party names/abbreviations to our canonical short codes.
 * The House XML uses various formats; this handles normalization.
 */
export const PARTY_NAME_MAP: Record<string, string> = {
  // English full names
  'Liberal': 'LPC',
  'Liberal Party of Canada': 'LPC',
  'Conservative': 'CPC',
  'Conservative Party of Canada': 'CPC',
  'NDP': 'NDP',
  'New Democratic Party': 'NDP',
  'Bloc Québécois': 'BQ',
  'Bloc Quebecois': 'BQ',
  'Bloc': 'BQ',
  'Green Party': 'GPC',
  'Green Party of Canada': 'GPC',
  'Green': 'GPC',
  'Independent': 'IND',
  // French full names
  'Libéral': 'LPC',
  'Parti libéral du Canada': 'LPC',
  'Conservateur': 'CPC',
  'Parti conservateur du Canada': 'CPC',
  'Nouveau Parti démocratique': 'NDP',
  'Parti vert': 'GPC',
  'Indépendant': 'IND',
  // Short codes / abbreviations (OpenParliament API, XML feeds)
  'LPC': 'LPC',
  'Lib.': 'LPC',
  'CPC': 'CPC',
  'Con.': 'CPC',
  'NPD': 'NDP',
  'BQ': 'BQ',
  'BLQ': 'BQ',
  'GPC': 'GPC',
  'PV': 'GPC',
  'IND': 'IND',
  'Ind.': 'IND',
};

export const PARTY_SORT_ORDER: string[] = ['LPC', 'CPC', 'NDP', 'BQ', 'GPC', 'IND'];

/**
 * Canadian provinces and territories for constituency mapping.
 */
export const PROVINCES: Record<string, string> = {
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NS: 'Nova Scotia',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Quebec',
  SK: 'Saskatchewan',
  YT: 'Yukon',
};
