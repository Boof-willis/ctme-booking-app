'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { COURSE_URL, FALLBACK_EMAIL, MINIMUM_ENGAGEMENT_USD } from '@/lib/constants';
import { UTMParams } from '@/types/survey';
import { trackCourseClick, trackDisqualified, trackQuoteClick } from '@/lib/tracking';

type Reason = 'region' | 'size';

interface DisqualifiedScreenProps {
  reason?: Reason;
  utmParams?: UTMParams;
  /** Size variant only: rejoin the flow to request an email quote. */
  onRequestQuote?: () => void;
}

const PASSTHROUGH_UTMS: (keyof UTMParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'fbclid', 'gclid'];

function buildCourseUrl(utmParams?: UTMParams): string {
  const url = new URL(COURSE_URL);
  for (const key of PASSTHROUGH_UTMS) {
    const v = utmParams?.[key];
    if (v) url.searchParams.set(key, v);
  }
  url.searchParams.set('utm_content', 'booking-app-course-redirect');
  return url.toString();
}

function InfoIcon() {
  return (
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-black border border-zinc-800">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#beb086]">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const CTA_CLASSES = `
  block w-full rounded-none bg-[#beb086] text-center
  py-3.5 text-base font-bold text-black font-mono uppercase tracking-wider
  transition-colors hover:bg-[#a69970] cursor-pointer
`;

export default function DisqualifiedScreen({ reason = 'region', utmParams, onRequestQuote }: DisqualifiedScreenProps) {
  const courseUrl = useMemo(() => buildCourseUrl(utmParams), [utmParams]);

  const handleRequestQuote = () => {
    trackQuoteClick();
    onRequestQuote?.();
  };

  useEffect(() => {
    if (reason === 'size') trackDisqualified();
  }, [reason]);

  if (reason === 'region') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center px-6 py-16"
      >
        <InfoIcon />
        <h1 className="text-2xl font-bold text-white mb-3">
          We&apos;re not available in your region yet
        </h1>
        <p className="text-zinc-500 font-mono text-sm max-w-sm leading-relaxed">
          &gt; We currently serve clients in Australia, Canada, New Zealand, the UK, and the USA.
          We&apos;re expanding — check back soon.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center px-2 sm:px-6 py-8 sm:py-12"
    >
      <InfoIcon />

      <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-3">
        Good news: you probably don&apos;t need our full service package
      </h1>

      <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed mb-6">
        Our full service packages start at ${MINIMUM_ENGAGEMENT_USD.toLocaleString()} and are built for
        larger, messier histories. Based on what you shared, that&apos;s more than you need to spend.
      </p>

      <div className="w-full max-w-md rounded-none border border-[#beb086]/30 bg-[#beb086]/5 p-5 mb-4 text-left">
        <p className="font-mono text-xs uppercase tracking-wider text-[#beb086] mb-2">
          &gt; The better fit
        </p>
        <p className="text-white font-bold mb-2">High Level Review Package</p>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          Get a quote for having a team member review your account and correct the highest
          tax impact issues.
        </p>
        <button type="button" onClick={handleRequestQuote} className={CTA_CLASSES}>
          [ Request Quote ]
        </button>
      </div>

      <div className="w-full max-w-md rounded-none border border-zinc-800 bg-black p-5 mb-6 text-left">
        <p className="font-mono text-xs uppercase tracking-wider text-[#beb086] mb-2">
          &gt; The DIY option
        </p>
        <p className="text-white font-bold mb-2">Crypto Tax Made Easy Course</p>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          The exact process our specialists use to fix cost basis, catch what the software gets wrong,
          and hand your accountant clean numbers. Do it yourself, at your pace, for a fraction of the cost.
        </p>
        <a href={courseUrl} onClick={trackCourseClick} className={CTA_CLASSES}>
          [ See the Course ]
        </a>
      </div>

      <p className="text-zinc-600 font-mono text-xs max-w-sm leading-relaxed">
        &gt; Think your situation is more complex than these numbers suggest?{' '}
        <a href={`mailto:${FALLBACK_EMAIL}`} className="text-zinc-400 hover:text-[#beb086] underline transition-colors">
          Email us
        </a>{' '}
        and tell us what&apos;s going on.
      </p>
    </motion.div>
  );
}
