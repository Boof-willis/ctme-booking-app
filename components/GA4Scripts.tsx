'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * GA4 / Google Ads gtag.js. Skipped entirely on /awesomely — that flow is a
 * separate, partner co-branded intake and isn't meant to feed the paid-ads
 * analytics/remarketing setup the rest of the site uses. GTM and the Meta
 * Pixel (in app/layout.tsx) are untouched; this only covers the direct
 * gtag.js integration that lib/tracking.ts's window.gtag?.(...) calls target.
 */
export function GA4Scripts() {
  const pathname = usePathname();
  if (!GA4_ID || pathname?.startsWith('/awesomely')) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
        `}
      </Script>
    </>
  );
}
