import Image from 'next/image';
import SurveyFlow from '@/components/SurveyFlow';

export default function AwesomelyPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-3 sm:mb-4 w-full flex flex-col items-center gap-2 sm:gap-3">
        <Image
          src="/ctme-logo.png"
          alt="Crypto Tax Made Easy"
          width={1920}
          height={1080}
          className="w-[140px] sm:w-[180px] h-auto object-contain opacity-80"
          priority
        />
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-zinc-600">
          In partnership with
        </span>
        <Image
          src="/awesomely-logo.svg"
          alt="Awesomely"
          width={160}
          height={19}
          className="w-[150px] sm:w-[180px] h-auto object-contain opacity-90"
          priority
        />
      </div>

      <div className="w-full max-w-[560px]">
        <div className="rounded-none border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black/40">
          <SurveyFlow tag="awesomely" />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Your information is secure and will never be shared with third parties.
        </p>
      </div>
    </main>
  );
}
