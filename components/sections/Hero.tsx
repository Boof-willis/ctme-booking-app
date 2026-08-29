import { ConsultationLink } from '@/components/ui/ConsultationLink';
import { SeasonalBanner } from '@/components/sections/SeasonalBanner';
import { MINIMUM_ENGAGEMENT_USD } from '@/lib/constants';

export type HeroVariant = 'master' | 'near-me';

const VARIANTS = {
  master: {
    eyebrow: '> Remote crypto tax accountants. We work with clients in all 50 states.',
    headline: (
      <>
        Crypto Tax Accountants Who<br className="hidden sm:block" /> Actually Read the Chain.
      </>
    ),
    body: (
      <>
        You don&apos;t have a tax problem. You&apos;ve got a data problem. Koinly says one
        number, Awaken says another, and two wallets are missing. We rebuild the history
        from the chain, correct the cost basis, and hand back numbers that are ready to
        file. Flat-rate pricing. Starts with a free 15-minute call.
      </>
    ),
    remoteNote: (
      <>
        No local crypto CPA? You don&apos;t need one. Everything happens over a call and
        inside secure practice management software, the same as we&apos;ve done for 737+
        clients.
      </>
    ),
  },
  'near-me': {
    eyebrow: '> Crypto Accountant Near You · We Work Remotely, US-Wide',
    headline: (
      <>
        Looking for a Crypto<br />Accountant Near You?
      </>
    ),
    body: (
      <>
        There probably isn&apos;t one. Crypto-fluent accountants are scarce in most cities,
        which is exactly why we work remotely with clients across the US. You get a
        specialist who reconciles every transaction by hand instead of the nearest
        generalist who has never seen a liquidity pool. Starts with a free 15-minute call.
      </>
    ),
    remoteNote: null,
  },
} as const;

export function Hero({ variant = 'master' }: { variant?: HeroVariant }) {
  const copy = VARIANTS[variant];

  return (
    <section className="relative min-h-[72vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 sm:pt-32 pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(190,176,134,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
        <SeasonalBanner />

        {/* Group 1: Eyebrow + H1 */}
        <div className="mb-4">
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            {copy.eyebrow}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            {copy.headline}
          </h1>
        </div>

        {/* Group 2: Stat + Subtext */}
        <div className="mb-8 flex flex-col items-center">
          <span className="text-4xl md:text-5xl font-mono text-[#beb086]">
            $100.2M
          </span>
          <span className="font-mono text-xs sm:text-sm uppercase text-zinc-500 mt-3 tracking-wider max-w-md leading-relaxed">
            in overstated gains corrected across 802 client reports
          </span>
        </div>

        {/* Group 3: Main body paragraph */}
        <p className={`text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed ${copy.remoteNote ? 'mb-4' : 'mb-8'}`}>
          {copy.body}
        </p>

        {/*
          Answers "is there a crypto tax accountant near me" above the fold, so the
          local-office objection is handled before any scrolling.
        */}
        {copy.remoteNote && (
          <p className="text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            {copy.remoteNote}
          </p>
        )}

        {/* Group 4: Trust metrics + Buttons */}
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400 font-mono text-sm tracking-tight mb-6">
            <span className="flex items-center gap-1">
              <span className="text-[#beb086]">★★★★★</span>
              <span className="ml-1">5.0 Average</span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>737+ Done-For-You Clients</span>
            <span className="hidden sm:inline">·</span>
            <span>6.7M Transactions Reconciled</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <ConsultationLink
              section="hero"
              className="w-full sm:w-auto rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)] flex items-center justify-center gap-2"
            >
              Book Your Free Consultation <span>→</span>
            </ConsultationLink>
            <a
              href="#how-it-works"
              className="bg-black border border-zinc-600 text-white hover:border-[#beb086] transition-colors rounded-none px-8 py-4 flex items-center justify-center gap-3 relative overflow-hidden group w-full sm:w-auto text-base font-medium"
            >
              <span className="font-mono text-[#beb086] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                &gt;
              </span>
              <span className="relative z-10 transition-transform duration-300">See How It Works</span>
            </a>
          </div>

          {/*
            Price floor surfaced from the FAQ's "What does it cost to get started?"
            answer. Deliberate lead qualification: at paid-search click costs we want
            fewer, better-fit bookings rather than more of them.
          */}
          <p className="font-mono text-xs sm:text-sm text-zinc-400 mt-4 max-w-xl leading-relaxed">
            You get a flat-rate quote before you commit. Our done-for-you service has a
            ${MINIMUM_ENGAGEMENT_USD.toLocaleString()} minimum engagement.
          </p>

          {/*
            Stays neutral on who files. Per ctme-ad-scripts-batch1.md, CTME can file
            and no asset should claim a limit that doesn't exist, so this says the
            numbers are ready to file without assigning the filing to anyone.
          */}
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-zinc-500 mt-6 max-w-xl leading-relaxed">
            Every transaction checked against the chain, so you or your accountant file
            off numbers that hold up.
          </p>
        </div>
      </div>
    </section>
  );
}
