import Image from 'next/image';
import SurveyFlow from '@/components/SurveyFlow';

export default function ConsultationPage() {
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
        <div className="rounded-2xl border border-white/[0.06] bg-[#12121A] p-6 sm:p-8 shadow-2xl shadow-black/20">
          <SurveyFlow />
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Your information is secure and will never be shared with third parties.
        </p>
      </div>
    </main>
  );
}
