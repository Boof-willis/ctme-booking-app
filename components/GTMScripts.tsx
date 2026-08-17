'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GTM_ID = 'GTM-NJC9M4B';

/**
 * Google Tag Manager. Skipped on /awesomely.
 *
 * GTM's own container (managed in Google's UI, not this repo) has its own
 * internally-configured GA4 and Google Ads tags that fire on an "All Pages"
 * trigger — that's the actual, observed source of the gtag.js requests and
 * gtag('config', ...) calls on every route, completely independent of the
 * direct gtag.js integration in GA4Scripts.tsx (which is a no-op here since
 * NEXT_PUBLIC_GA4_MEASUREMENT_ID is unset). There's no way to tell GTM's own
 * tags "don't fire on this URL" from this codebase — that lives inside the
 * GTM container's own trigger rules. Not loading the container at all here is
 * the only lever available from code, which means /awesomely also loses
 * whatever else might be configured in that container beyond GA4/Ads.
 */
export function GTMScripts() {
  const pathname = usePathname();
  if (pathname?.startsWith('/awesomely')) return null;

  return (
    <>
      <Script id="gtm-head" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
