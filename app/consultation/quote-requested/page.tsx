import type { Metadata } from 'next';
import Image from 'next/image';
import { COURSE_URL, FALLBACK_EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Quote Requested | Crypto Tax Made Easy',
  robots: { index: false, follow: false },
};

const NEXT_STEPS = [
  'A team member reviews the details you just shared',
  'We put together a High Level Review quote for your situation',
  'It lands in your inbox — reply to that email with any questions',
];

const courseUrl = `${COURSE_URL}?utm_content=booking-app-quote-confirmation`;

export default function QuoteRequestedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-3 sm:mb-4 w-full flex justify-center opacity-80">
        <Image
          src="/ctme-logo.png"
          alt="Crypto Tax Made Easy"
          width={1920}
          height={1080}
          className="w-[140px] sm:w-[180px] h-auto object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-[560px]">
        <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-none bg-[#beb086]/10 border border-[#beb086]/20 mb-4">
              <span className="text-3xl grayscale">📬</span>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-white mb-3">
              Quote request received
            </h1>
            <p className="font-mono text-[#beb086] text-sm">
              &gt; We&apos;ll email your High Level Review quote to the address you gave us
            </p>
          </div>

          <div className="rounded-none border border-zinc-800 bg-black p-5 mb-6">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">
              [ What happens next ]
            </p>
            <ul className="space-y-3">
              {NEXT_STEPS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-300">
                  <span className="text-[#beb086] font-mono mt-0.5 shrink-0">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Want to get started on your own in the meantime?{' '}
            <a href={courseUrl} className="text-[#beb086] hover:underline transition-colors">
              See the course →
            </a>
          </p>

          <p className="text-zinc-600 font-mono text-xs leading-relaxed">
            &gt; Didn&apos;t mean to request a quote, or would rather talk it through?{' '}
            <a href={`mailto:${FALLBACK_EMAIL}`} className="text-zinc-400 hover:text-[#beb086] underline transition-colors">
              Email us
            </a>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Your information is secure and will never be shared with third parties.
        </p>
      </div>
    </main>
  );
}
