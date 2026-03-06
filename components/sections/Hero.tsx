export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-32 sm:pt-40 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(190,176,134,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center w-full">
        {/* Group 1: Eyebrow + H1 */}
        <div className="mb-6">
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#beb086] mb-6 block">
            &gt; Crypto Tax Specialists
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            Your Crypto Taxes,<br />Done For You.
          </h1>
        </div>
        
        {/* Group 2: Stat + Subtext */}
        <div className="mb-12 flex flex-col items-center">
          <span className="text-5xl md:text-6xl font-mono text-[#beb086]">
            $21.8M+
          </span>
          <span className="font-mono text-xs sm:text-sm uppercase text-zinc-500 mt-4 tracking-wider">
            in tax savings for our clients
          </span>
        </div>
        
        {/* Group 3: Main body paragraph */}
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          We manually review every transaction, fix what software gets wrong,
          and deliver an audit-ready report your accountant can file.
          Flat-rate pricing. 20 minutes of your time.
        </p>
        
        {/* Group 4: Trust metrics + Buttons */}
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400 font-mono text-sm tracking-tight mb-8">
            <span className="flex items-center gap-1">
              <span className="text-[#beb086]">★★★★★</span>
              <span className="ml-1">4.96 Average Review</span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>200+ Clients</span>
            <span className="hidden sm:inline">·</span>
            <span>5+ Years Experience</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="https://book.ctme.io/consultation?utm_content=hero"
              className="w-full sm:w-auto rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)] flex items-center justify-center gap-2"
            >
              Book Your Free Consultation <span>→</span>
            </a>
            <a
              href="#how-it-works"
              className="bg-black border border-zinc-600 text-white hover:border-[#beb086] transition-colors rounded-none px-8 py-4 flex items-center justify-center gap-3 relative overflow-hidden group w-full sm:w-auto text-base font-medium"
            >
              <span className="font-mono text-[#beb086] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                &gt;
              </span>
              <span className="relative z-10 transition-transform duration-300">See How It Works</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
