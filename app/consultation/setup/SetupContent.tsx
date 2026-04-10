'use client';

import { useSearchParams } from 'next/navigation';
import {
  VideoPlayer,
  KoinlySteps,
  SetupCompleteButton,
  GoogleMeetReminder,
} from '@/components/KoinlySetup';

export default function SetupContent() {
  const searchParams = useSearchParams();
  const contactId = searchParams.get('contact_id');

  return (
    <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40">
      <VideoPlayer src="https://assets.cdn.filesafe.space/bkl1s4il2Wd9IOmUteYI/media/69d69623e84e918446c3431f.mp4" />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-2">
          How to set up Koinly
        </h1>
        <p className="text-zinc-500 text-sm font-mono">
          Complete these steps before your call so we can hit the ground running.
        </p>
      </div>

      <KoinlySteps hasButton={!!contactId} />

      {contactId ? (
        <SetupCompleteButton contactId={contactId} />
      ) : (
        <div className="rounded-none border border-[#beb086]/20 bg-[#beb086]/5 p-4 mb-6 text-center">
          <p className="text-zinc-300 text-sm font-mono">
            If you&apos;ve completed setup, you&apos;re all set for your call.
          </p>
        </div>
      )}

      <GoogleMeetReminder />
    </div>
  );
}
