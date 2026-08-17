import { ConsultationLink } from '@/components/ui/ConsultationLink';

export function ProblemSection() {
  const problems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
          <path d="m18 2 4 4-4 4" />
          <path d="m18 14 4 4-4 4" />
          <path d="M2 6h3.973a4 4 0 0 1 3.3 1.7l5.454 8.6a4 4 0 0 0 3.3 1.7H22" />
          <path d="M2 18h3.973a4 4 0 0 0 3.3-1.7l.354-.55" />
          <path d="M14.4 8.25l.327-.516A4 4 0 0 1 18.027 6H22" />
        </svg>
      ),
      heading: "Your Tools Disagree With Each Other",
      body: "Koinly says one number. Awaken says another. CoinTracker says a third. All three are reading the same chain, so at most one of them is right. Until somebody reconciles the source data, you are picking a tax bill, not calculating one."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
      ),
      heading: "One Missing Wallet Breaks Everything After It",
      body: "An unlinked wallet turns every transfer out of it into a phantom sale with no cost basis. Missing cost basis is the most common error we find, and it does not stay in one year. It compounds into every year that follows."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mb-4">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="23" y2="12" />
          <line x1="23" y1="8" x2="19" y2="12" />
        </svg>
      ),
      heading: "Your Accountant Can't Audit What They Can't Read",
      body: "Most CPAs have zero training on digital assets. They'll tell you to \"just report what you put in and what it's worth now.\" That advice could cost you tens of thousands in overpaid taxes."
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
            You Don't Have a Tax Problem.<br className="hidden sm:block" /> You've Got a Data Problem.
          </h2>
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
            Thousands of transactions across multiple exchanges, wallets, and chains.
            DeFi, NFTs, airdrops, perps. The tax is the easy part. Working out what
            actually happened is the job.
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
            100%
          </div>
          <p className="text-xl sm:text-2xl text-zinc-300 font-medium leading-relaxed max-w-2xl mx-auto">
            of the 802 client reports we reviewed contained at least one material error.
            <br className="hidden sm:block" />
            <span className="text-white mt-2 block">We find them. Then we fix them.</span>
          </p>
        </div>

        <div className="text-center">
          <ConsultationLink
            section="problem-section"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Book Your Free Tax Review <span>→</span>
          </ConsultationLink>
        </div>
      </div>
    </section>
  );
}
