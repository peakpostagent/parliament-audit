import Script from 'next/script';

/**
 * Privacy-friendly analytics — self-hosted Umami on Railway.
 *
 * Required env vars (set on the parliament-audit web service):
 *   NEXT_PUBLIC_UMAMI_URL          — base URL of the Umami instance
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID   — UUID Umami issues per registered site
 *
 * If either is missing this component renders nothing (local dev,
 * preview deploys, etc.). No cookies, no personal data, no ad tech.
 */
export function Analytics() {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (!umamiUrl || !websiteId) return null;

  return (
    <Script
      defer
      src={`${umamiUrl}/script.js`}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
