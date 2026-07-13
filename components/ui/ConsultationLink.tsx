'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getConsultationURL } from '@/lib/utm';

const CONSULTATION_URL = 'https://book.ctme.io/consultation';

interface ConsultationLinkProps {
  section: string;
  className?: string;
  children: ReactNode;
}

/**
 * CTA anchor pointing at the consultation intake form. Renders a stable
 * SSR/no-JS href (`?utm_content={section}`) and, after mount, upgrades the href
 * to include any captured UTM params so attribution survives new-tab clicks.
 */
export function ConsultationLink({ section, className, children }: ConsultationLinkProps) {
  const [href, setHref] = useState(
    `${CONSULTATION_URL}?utm_content=${encodeURIComponent(section)}`
  );

  useEffect(() => {
    setHref(getConsultationURL(section));
  }, [section]);

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
