import Script from 'next/script';

/**
 * Privacy-friendly analytics. Supports Plausible out of the box.
 *
 * To enable:
 *   - Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN=parliamentaudit.ca on Railway
 *   - Optionally set NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL to self-host
 *
 * If NEXT_PUBLIC_PLAUSIBLE_DOMAIN is not set, this component renders nothing.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const scriptUrl =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || 'https://plausible.io/js/script.js';

  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src={scriptUrl}
      strategy="afterInteractive"
    />
  );
}
