import { isExtensionSeasonActive } from '@/lib/constants';

/**
 * Extension-deadline strip. Renders only inside EXTENSION_DEADLINE_WINDOW.
 *
 * Evaluated at build time (server component, no 'use client'), so outside the
 * window this ships nothing at all. Flipping the window needs a redeploy.
 *
 * Naming October 15 is safe here in a way it is not in the video ads: those cuts
 * run in both US and AU, so ctme-ad-scripts-batch1.md bans country-specific dates.
 * These pages serve a US-only Search campaign.
 */
export function SeasonalBanner() {
  if (!isExtensionSeasonActive()) return null;

  return (
    <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 border border-amber-500/30 bg-amber-500/5 px-5 py-3 mb-8">
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-amber-500 whitespace-nowrap">
        There&apos;s No Extension to the Extension
      </span>
      <span className="hidden sm:inline text-zinc-700">|</span>
      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 text-center sm:text-left">
        October 15 is the last filing date for 2025 returns
      </span>
    </div>
  );
}
