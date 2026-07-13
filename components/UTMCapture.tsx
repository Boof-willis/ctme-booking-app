'use client';

import { useEffect } from 'react';
import { parseUTMParams } from '@/lib/utm';

/**
 * Captures UTM / tracking params into sessionStorage on first load of any route
 * (home page, /book, /schedule, etc.) so attribution survives a click-through to
 * the /consultation intake form even when the CTA link only carries utm_content.
 * Renders nothing.
 */
export function UTMCapture() {
  useEffect(() => {
    parseUTMParams();
  }, []);

  return null;
}
