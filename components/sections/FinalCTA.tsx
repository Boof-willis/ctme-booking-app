import { ConsultationLink } from '@/components/ui/ConsultationLink';
import { isExtensionSeasonActive } from '@/lib/constants';

export function FinalCTA() {
  // Gated on the same window as SeasonalBanner so the two appear and vanish together.
  const extensionSeason = isExtensionSeasonActive();

  return (
    <section className="bg-[#0A0A0F] py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(190,176,134,0.06)_0%,transparent_60%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
          Stop Stressing About Crypto Taxes.
        </h2>
        
        <p className="text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Book a free, no-obligation consultation. We'll review your situation
          and show you exactly how we can help.
        </p>
        
        <ConsultationLink
          section="final-cta"
          className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-10 py-5 text-lg font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(190,176,134,0.2)] mb-6 w-full sm:w-auto"
        >
          Book My Free Consultation <span>→</span>
        </ConsultationLink>
        
        <div className="font-mono text-sm text-zinc-500 mb-12">
          No credit card. No commitment. Free expert advice.
        </div>
        
        <div className="border border-[#beb086]/20 bg-zinc-900/50 rounded-none p-5 max-w-lg mx-auto mb-10 shadow-2xl shadow-black/40">
          <p className="text-zinc-300 text-sm mb-3">
            "My tax savings more than paid for the cost of the service."
          </p>
          <div className="flex items-center justify-center gap-2 font-mono text-xs">
            <span className="text-white font-bold">— Richee,</span>
            <span className="text-zinc-500 uppercase tracking-wider">Verified Client</span>
            <span className="text-[#beb086] tracking-widest ml-1">★★★★★</span>
          </div>
        </div>

        {extensionSeason && (
          <div className="font-mono text-xs text-amber-500 uppercase tracking-widest inline-block border border-amber-500/20 bg-amber-500/5 px-4 py-2">
            There's no extension to the extension · October 15 is the last filing date for 2025 returns
          </div>
        )}
      </div>
    </section>
  );
}
