import SurveyFlow from '@/components/SurveyFlow';

export default function ConsultationPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Crypto Tax Made Easy
        </h2>
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
