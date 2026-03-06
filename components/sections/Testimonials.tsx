export function Testimonials() {
  const StarRow = () => (
    <div className="flex items-center gap-1 text-[#beb086] mb-4">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#beb086]">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );

  return (
    <section id="results" className="bg-zinc-950 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            Client Results
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
            What Happens When We Review Your Report
          </h2>
          <div className="inline-flex items-center justify-center gap-2 border border-[#beb086] bg-[#beb086]/5 px-4 py-2 font-mono text-sm text-[#beb086]">
            ★ Rated 4.96 Stars · 200+ Reviews
          </div>
        </div>

        <div className="md:columns-2 gap-6 space-y-6 mb-16">
          {/* Featured Testimonial (Jake) */}
          <div className="break-inside-avoid bg-zinc-900 border border-zinc-800 p-8 sm:p-10 shadow-2xl shadow-black/40 relative">
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-12 mb-8 pb-8 border-b border-zinc-800">
              <div>
                <span className="block text-zinc-500 text-sm font-mono uppercase tracking-wider mb-2">Software reported:</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-500">$30,000-$40,000 profit</span>
              </div>
              <div>
                <span className="block text-zinc-500 text-sm font-mono uppercase tracking-wider mb-2">After our review:</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#beb086]">$14,000 loss</span>
              </div>
            </div>
            <div className="relative">
              <span className="absolute -top-6 -left-4 text-7xl font-sans text-[#beb086]/20 leading-none">"</span>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8 relative z-10 pl-6">
                The Crypto Taxes Made Easy team made it incredibly easy for me to prepare tax reports for all cryptocurrency and NFT activity. I dealt with around 4,000 transactions. I tried doing the crypto taxes by myself, but couldn't decipher the different terminology inside Koinly. I felt overwhelmed. Crypto Taxes Made Easy took the reins.
              </p>
              <div className="pl-6">
                <StarRow />
                <div className="font-bold text-white">— Jake</div>
                <div className="font-mono text-xs text-zinc-500 mt-1 uppercase tracking-wider">Verified Client</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 (Corey) */}
          <div className="break-inside-avoid bg-zinc-900 border border-zinc-800 p-8 shadow-2xl shadow-black/40">
            <span className="block text-5xl font-sans text-[#beb086]/20 leading-none mb-2 -ml-2">"</span>
            <p className="text-zinc-300 leading-relaxed mb-8 relative z-10">
              Thanks Matt! You saved me so much stress and many hours of trying to figure out my taxes this year. I had a lot of transactions and more than just basic swapping of coins. Defi staking. Liquidity pools, NFT's, etc etc. These can get very complicated, and I was at a point that I was very overwhelmed. Once I decided to just do the "Crypto Done For Me", Matt made things easy…
            </p>
            <StarRow />
            <div className="font-bold text-white">— Corey</div>
            <div className="font-mono text-xs text-zinc-500 mt-1 uppercase tracking-wider">Verified Client</div>
          </div>

          {/* Testimonial 3 (Mason) */}
          <div className="break-inside-avoid bg-zinc-900 border border-zinc-800 p-8 shadow-2xl shadow-black/40">
            <span className="block text-5xl font-sans text-[#beb086]/20 leading-none mb-2 -ml-2">"</span>
            <p className="text-zinc-300 leading-relaxed mb-8 relative z-10">
              I'm so grateful that I found Matthew and the community here. I was staring at thousands of transactions to sift through and get it into a report for my tax software. I didn't know where to start until I found him. I literally wanted all the work of reconciling all the crypto transactions to be taken care of. So all I had to do was download the report. The service is professional and to the point.
            </p>
            <StarRow />
            <div className="font-bold text-white">— Mason</div>
            <div className="font-mono text-xs text-zinc-500 mt-1 uppercase tracking-wider">Verified Client</div>
          </div>

          {/* Testimonial 4 (Richee) */}
          <div className="break-inside-avoid bg-zinc-900 border border-zinc-800 p-8 shadow-2xl shadow-black/40">
            <span className="block text-5xl font-sans text-[#beb086]/20 leading-none mb-2 -ml-2">"</span>
            <p className="text-zinc-300 leading-relaxed mb-8 relative z-10">
              The service provided by CTME was exceptional. I had nearly 4,000 transactions and was completely lost in how to accurately report this on my taxes. Not only did my report come in timely, I went from a capital gains to a capital loss position allowing me to deduct from my taxable income. <strong className="text-white">My tax savings more than paid for the cost of the service.</strong> Your service is top notch.
            </p>
            <StarRow />
            <div className="font-bold text-white">— Richee</div>
            <div className="font-mono text-xs text-zinc-500 mt-1 uppercase tracking-wider">Verified Client</div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://book.ctme.io/consultation?utm_content=testimonials"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Book My Free Consultation <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
