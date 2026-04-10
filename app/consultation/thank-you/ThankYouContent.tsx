'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  VideoPlayer,
  KoinlySteps,
  SetupCompleteButton,
  GoogleMeetReminder,
} from '@/components/KoinlySetup';

function YesTrack() {
  return (
    <>
      <VideoPlayer src="https://assets.cdn.filesafe.space/bkl1s4il2Wd9IOmUteYI/media/69d86836982fd67a35ff5991.mp4" />

      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-none bg-[#beb086]/10 border border-[#beb086]/20 mb-4">
          <span className="text-3xl grayscale">🎉</span>
        </div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-3">
          You&apos;re booked!
        </h1>
        <p className="text-zinc-400 text-sm font-mono">
          This is a Google Meet call. Check your <span className="text-white">primary inbox</span> or{' '}
          <span className="text-white">spam folder</span> for the meeting link.
        </p>
      </div>

      <div className="rounded-none border border-zinc-800 bg-black p-5">
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
          [ Prep checklist ]
        </p>
        <ul className="space-y-3">
          {[
            'Have your crypto tax software open and connected',
            'Know your approximate transaction count',
            'Know which tax year(s) you need help with',
            'Be somewhere quiet with no distractions',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
              <span className="text-[#beb086] font-mono mt-0.5 shrink-0">&gt;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function NoTrack({ contactId }: { contactId: string }) {
  const [koinlyClicked, setKoinlyClicked] = useState(false);
  const handleKoinlyClick = useCallback(() => setKoinlyClicked(true), []);

  return (
    <>
      <VideoPlayer src="https://assets.cdn.filesafe.space/bkl1s4il2Wd9IOmUteYI/media/69d86836019dc508d3e14797.mp4" />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
          How to set up Koinly
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Complete these steps before your call so we can hit the ground running.
        </p>
      </div>

      <KoinlySteps onKoinlyClick={handleKoinlyClick} />
      <SetupCompleteButton contactId={contactId} disabled={!koinlyClicked} />
      <GoogleMeetReminder />
    </>
  );
}

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const hasSoftware = searchParams.get('has_software');
  const [contactId, setContactId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ctme_contact_id');
      if (stored) setContactId(stored);
    } catch { /* unavailable */ }
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40 flex items-center justify-center min-h-[400px]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (hasSoftware === 'yes') {
    return (
      <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40">
        <YesTrack />
      </div>
    );
  }

  if (!contactId) {
    return (
      <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40 text-center">
        <p className="text-zinc-400 font-mono text-sm">
          Invalid link. Please complete the{' '}
          <a href="/consultation" className="text-[#beb086] hover:text-[#a69970] transition-colors">
            consultation form
          </a>{' '}
          to book your call.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40">
      <NoTrack contactId={contactId} />
    </div>
  );
}
