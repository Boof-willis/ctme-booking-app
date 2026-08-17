import { ConsultationLink } from '@/components/ui/ConsultationLink';

/**
 * Measured figures only. The modelled outputs from the same study ($7,551 median
 * benefit, the $2,199 / $1,561 median tax impacts, the 2.3x / 2.7x ratios) are on
 * the do-not-use-in-creative list in ctme-ad-scripts-batch1.md: they are model
 * outputs, not operational measurements, and cannot be defended on a sales call.
 */
const STATS = [
  { value: '304', label: 'Investors Studied' },
  { value: '802', label: 'Reports Checked' },
  { value: '100%', label: 'Had a Material Error' },
  { value: '$100.2M', label: 'Overstated Gains Corrected' },
  { value: '$51.0M', label: 'Underreported Gains Caught' },
];

export function ImpactStudy() {
  return (
    <section id="study" className="bg-[#0A0A0F] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            &gt; Client Impact Study · 2021&ndash;2026
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            We Checked 802 Reports.<br className="hidden sm:block" /> Every Single One Had an Error.
          </h2>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Across 304 investors and six tax years, we reviewed every report that came
            through our door. Missing cost basis, double-counted transactions, asset
            mispricing, transfers booked as sales. And the risk did not only run one way.
          </p>
        </div>

        {/* The both-directions split: the "was it done right" argument. */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl shadow-black/40">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-500 block mb-4">
              Overpaid · 452 Reports
            </span>
            <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
              Gains Overstated
            </h3>
            <div className="text-4xl sm:text-5xl font-mono text-[#beb086] mb-2 tracking-tight">
              56.4%
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-6">
              of the reports we checked
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Money sitting with the government that was never theirs. When the software
              is not sure about a transaction it assumes the highest liability, because
              that is the safe direction for the software, not for you.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl shadow-black/40">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-500 block mb-4">
              Exposed · 350 Reports
            </span>
            <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
              Gains Underreported
            </h3>
            <div className="text-4xl sm:text-5xl font-mono text-[#beb086] mb-2 tracking-tight">
              43.6%
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-6">
              of the reports we checked
            </p>
            <p className="text-zinc-400 leading-relaxed">
              A completely different problem. If you overpaid, that is your money sitting
              with the government. If you underpaid, you owe something and you do not know
              about it yet. And you could easily be in that half.
            </p>
          </div>
        </div>

        {/* Study stat row */}
        <div className="border-y border-zinc-800 py-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-mono text-[#beb086] mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unclaimed losses */}
        <div className="bg-zinc-900 border-l-2 border-l-[#beb086] border-y border-r border-zinc-800 rounded-none p-8 sm:p-10 max-w-4xl mx-auto mb-12 shadow-2xl shadow-black/40">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
            Capital losses don&apos;t expire.
          </h3>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Losses from 2021 and 2022 carry forward indefinitely, and most of them were
            never claimed. Not because anyone chose to skip them, but because tracing them
            means walking back through exchanges that no longer exist and wallets nobody
            has opened in three years. That is a reconciliation job. It is the one we do.
          </p>
        </div>

        <div className="text-center">
          <ConsultationLink
            section="impact-study"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Find Out Which Side You&apos;re On <span>→</span>
          </ConsultationLink>

          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-600 mt-8 max-w-3xl mx-auto leading-relaxed">
            Figures describe what we found in our own client reports, not what any
            individual will get. Historical results from a self-selected internal dataset,
            not a prediction or promise. Individual outcomes differ and may be zero.
          </p>
        </div>
      </div>
    </section>
  );
}
