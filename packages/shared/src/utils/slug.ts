/**
 * Generate a URL-safe slug for a vote article.
 */
export function generateVoteSlug(params: {
  billNumber: string | null;
  voteType: string;
  result: string;
  voteDate: string;
  voteNumber: number;
  chamber: string;
}): string {
  const parts: string[] = [];

  if (params.billNumber) {
    parts.push(`bill-${params.billNumber.toLowerCase()}`);
  }

  const typeSlug = params.voteType.replace(/_/g, '-');
  parts.push(typeSlug);
  parts.push(params.result);

  // Add date as month-year
  const date = new Date(params.voteDate);
  const month = date.toLocaleString('en-CA', { month: 'long' }).toLowerCase();
  const year = date.getFullYear();
  parts.push(`${month}-${year}`);

  // Add vote number for uniqueness
  parts.push(`vote-${params.voteNumber}`);

  return parts.join('-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
}

/**
 * Sanitize a string for use in a URL slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}
