'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getConsultationURL } from '@/lib/utm';
import { useUtmSourceOverride } from '@/components/UtmSourceProvider';

const CONSULTATION_URL = 'https://book.ctme.io/consultation';

interface ConsultationLinkProps {
  section: string;
  className?: string;
  children: ReactNode;
}

function buildInitialHref(section: string, source?: string): string {
  const params = new URLSearchParams();
  if (source) params.set('utm_source', source);
  params.set('utm_content', section);
  return `${CONSULTATION_URL}?${params.toString()}`;
}

/**
 * CTA anchor pointing at the consultation intake form. Renders a stable
 * SSR/no-JS href (`?utm_content={section}`, plus a forced `utm_source` when a
 * UtmSourceProvider is present) and, after mount, upgrades the href to include
 * any captured UTM params so attribution survives new-tab clicks.
 */
export function ConsultationLink({ section, className, children }: ConsultationLinkProps) {
  const sourceOverride = useUtmSourceOverride();
  const [href, setHref] = useState(() => buildInitialHref(section, sourceOverride));

  useEffect(() => {
    setHref(getConsultationURL(section, sourceOverride ? { utm_source: sourceOverride } : undefined));
  }, [section, sourceOverride]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
