import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { UTMCapture } from '@/components/UTMCapture';
import { GA4Scripts } from '@/components/GA4Scripts';
import { GTMScripts } from '@/components/GTMScripts';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Crypto Tax Made Easy — Book Your Free Consultation',
  description:
    'Expert crypto tax reconciliation for high-net-worth clients in Australia, Canada, New Zealand, the UK, and the USA.',
};

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Meta Pixel */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* GA4 + Google Ads — components/GA4Scripts.tsx, skipped on /awesomely */}
        <GA4Scripts />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#0A0A0F] text-white`}>
        <GTMScripts />
        <UTMCapture />
        {children}
      </body>
    </html>
  );
}
