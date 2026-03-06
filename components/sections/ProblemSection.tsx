export function ProblemSection() {
  const problems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="23" y2="12" />
          <line x1="23" y1="8" x2="19" y2="12" />
        </svg>
      ),
      heading: "Your Accountant Doesn't Understand Crypto",
      body: "Most CPAs have zero training on digital assets. They'll tell you to \"just report what you put in and what it's worth now.\" That advice could cost you tens of thousands in overpaid taxes."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
      heading: "Tax Software Overreports Your Gains",
      body: "90% of the time, crypto tax software overestimates your capital gains. Wallet transfers get classified as sales. LP deposits get reported as disposals. You end up with a tax bill that's way higher than it should be."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      heading: "Doing It Yourself Takes Weeks",
      body: "If you've got 1,000+ transactions across multiple chains, manual reconciliation is a full-time job. Most people start, get overwhelmed, and either give up or file something inaccurate."
    }
  ];

  return (
    <section className="bg-zinc-950 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Crypto Taxes Are a Nightmare. They Don't Have to Be.
          </h2>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
            Thousands of transactions across multiple exchanges, wallets, and chains.
            DeFi, NFTs, airdrops, perps. Your accountant has never heard of half of it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((problem, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-none p-8 shadow-2xl shadow-black/40">
              {problem.icon}
              <h3 className="text-xl font-bold text-white mb-4 leading-snug">{problem.heading}</h3>
              <p className="text-zinc-400 leading-relaxed">{problem.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-none p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl shadow-black/40 mb-16">
          <div className="text-6xl sm:text-8xl font-bold text-[#beb086] mb-6 leading-none tracking-tighter">
            90%
          </div>
          <p className="text-xl sm:text-2xl text-zinc-300 font-medium leading-relaxed max-w-2xl mx-auto">
            of crypto tax software overestimates your capital gains.
            <br className="hidden sm:block" />
            <span className="text-white mt-2 block">We fix that.</span>
          </p>
        </div>

        <div className="text-center">
          <a
            href="https://book.ctme.io/consultation?utm_content=problem-section"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Book Your Free Tax Review <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
