'use client';

import { createContext, useContext, type ReactNode } from 'react';

const UtmSourceContext = createContext<string | undefined>(undefined);

/**
 * Forces a fixed `utm_source` for every ConsultationLink rendered beneath it.
 * Used by client-specific landing routes (e.g. /awesomely) so their CTAs and the
 * downstream intake form are attributed to that client without duplicating the
 * shared section components.
 */
export function UtmSourceProvider({
  source,
  children,
}: {
  source: string;
  children: ReactNode;
}) {
  return <UtmSourceContext.Provider value={source}>{children}</UtmSourceContext.Provider>;
}

export function useUtmSourceOverride(): string | undefined {
  return useContext(UtmSourceContext);
}
