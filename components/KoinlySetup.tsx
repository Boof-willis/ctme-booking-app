'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    setHasStarted(true);
    if (video.paused) video.play();
  };

  const handlePlay = () => setHasStarted(true);
  const handleVolumeChange = () => {
    if (videoRef.current) setMuted(videoRef.current.muted);
  };

  return (
    <div className="relative w-full rounded-none border border-zinc-800 overflow-hidden bg-black mb-6 group">
      <video
        ref={videoRef}
        className="w-full h-auto"
        controls
        preload="auto"
        playsInline
        muted
        onPlay={handlePlay}
        onVolumeChange={handleVolumeChange}
      >
        <source src={src} type="video/mp4" />
      </video>

      {muted && (
        <button
          onClick={handleUnmute}
          className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:bg-black/30 cursor-pointer"
        >
          <div className="flex flex-col items-center gap-3">
            {!hasStarted && (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#beb086] flex items-center justify-center shadow-lg shadow-black/50">
                <svg className="w-7 h-7 sm:w-9 sm:h-9 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            <span className="text-white text-xs font-mono bg-black/60 px-3 py-1.5 border border-zinc-700">
              {hasStarted ? '[ Click to unmute ]' : '[ Tap to play with sound ]'}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

export function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-none border border-zinc-800 bg-black p-4">
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-none border border-[#beb086]/30 bg-[#beb086]/10 text-[#beb086] font-mono text-xs font-bold">
          {number}
        </span>
        <div className="min-w-0">
          <h3 className="text-white font-mono text-sm font-bold">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

export function KoinlySteps({
  hasButton = true,
  onKoinlyClick,
}: {
  hasButton?: boolean;
  onKoinlyClick?: () => void;
}) {
  return (
    <div className="space-y-4 mb-8">
      <Step number={1} title="Create your free Koinly account">
        <a
          href="https://koinly.io/?via=E10BD73A&utm_source=affiliate"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onKoinlyClick}
          className="inline-flex items-center gap-2 text-[#beb086] hover:text-[#a69970] transition-colors font-mono text-sm mt-1"
        >
          Go to Koinly
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </Step>

      <Step number={2} title="Connect your wallets and exchanges">
        <p className="text-zinc-500 text-sm mt-1">
          Inside Koinly, use the &ldquo;Add Wallet&rdquo; button to connect each exchange
          (Coinbase, Binance, etc.) and blockchain wallet you&apos;ve used.
          You can import via API, CSV, or public address.
        </p>
      </Step>

      <Step number={3} title="Let Koinly sync your transactions">
        <p className="text-zinc-500 text-sm mt-1">
          Once connected, Koinly will automatically pull in your transaction history.
          This may take a few minutes depending on how many transactions you have.
        </p>
      </Step>

      <Step
        number={4}
        title={hasButton
          ? "Click the button below when you're done"
          : "You're all set once everything is synced"
        }
      >
        <p className="text-zinc-500 text-sm mt-1">
          {hasButton
            ? 'Once everything is connected and synced, let us know so we can prepare for your call.'
            : 'Once all your wallets and exchanges are connected and synced, you\'re ready for your call.'}
        </p>
      </Step>
    </div>
  );
}

export function SetupCompleteButton({
  contactId,
  disabled = false,
}: {
  contactId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetupComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/koinly-setup-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId }),
      });

      if (!res.ok) throw new Error('Request failed');

      router.push('/consultation/thank-you?has_software=yes');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSetupComplete}
        disabled={loading || disabled}
        className="w-full rounded-none border border-[#beb086] bg-[#beb086] text-black font-mono text-sm font-bold py-4 px-6 hover:bg-[#a69970] hover:border-[#a69970] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-6"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            Updating...
          </span>
        ) : disabled ? (
          '[ Complete step 1 first ]'
        ) : (
          '[ I\'ve completed setup — I\'m ready for my call ]'
        )}
      </button>

      {error && (
        <div className="rounded-none border border-red-500/30 bg-red-500/5 p-4 mb-6 text-center">
          <p className="text-red-400 text-sm font-mono mb-2">{error}</p>
          <button
            onClick={handleSetupComplete}
            className="text-[#beb086] hover:text-[#a69970] text-xs font-mono transition-colors"
          >
            [ Try again ]
          </button>
        </div>
      )}
    </>
  );
}

export function GoogleMeetReminder() {
  return (
    <div className="rounded-none border border-zinc-800 bg-black p-4 text-center">
      <p className="text-zinc-400 text-sm font-mono">
        Your call will be on <span className="text-white">Google Meet</span>.
        Check your primary inbox or spam folder for the meeting link.
      </p>
    </div>
  );
}
