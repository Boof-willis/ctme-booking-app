'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="w-full rounded-none border border-zinc-800 overflow-hidden bg-black mb-6">
      <video
        className="w-full h-auto"
        controls
        preload="metadata"
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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

export function KoinlySteps({ hasButton = true }: { hasButton?: boolean }) {
  return (
    <div className="space-y-4 mb-8">
      <Step number={1} title="Create your free Koinly account">
        <a
          href="https://koinly.io/?via=E10BD73A&utm_source=affiliate"
          target="_blank"
          rel="noopener noreferrer"
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

export function SetupCompleteButton({ contactId }: { contactId: string }) {
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
        disabled={loading}
        className="w-full rounded-none border border-[#beb086] bg-[#beb086] text-black font-mono text-sm font-bold py-4 px-6 hover:bg-[#a69970] hover:border-[#a69970] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            Updating...
          </span>
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
