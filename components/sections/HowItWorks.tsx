export function HowItWorks() {
  const steps = [
    {
      num: "01",
      time: "~20 min",
      title: "Quick Setup",
      desc: "Connect your wallets and exchanges to our recommended crypto tax software and grant us accountant-level access. That's it. That's your part."
    },
    {
      num: "02",
      time: "~24 hrs",
      title: "Fixed-Price Quote",
      desc: "Our team reviews your situation and sends one flat, all-in price. No hourly billing. No scope creep. No surprise invoices."
    },
    {
      num: "03",
      time: "~1-2 weeks",
      title: "Specialist Reconciliation",
      desc: "A trained crypto tax specialist manually reconciles every transaction using our proprietary process. DeFi, NFTs, multi-chain, perps, airdrops. Everything."
    },
    {
      num: "04",
      time: "Same day",
      title: "Audit-Ready Report",
      desc: "You receive a clean report your CPA can plug directly into your return. We support your CPA if they have questions. You're done."
    }
  ];

  return (
    <section id="how-it-works" className="bg-[#0A0A0F] py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            4 Steps. 20 Minutes of Your Time. Done.
          </h2>
        </div>

        <div className="relative grid md:grid-cols-4 gap-8 mb-20">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-zinc-800" />
          
          {/* Mobile connecting line */}
          <div className="md:hidden absolute top-[44px] bottom-[44px] left-[44px] w-[1px] bg-zinc-800" />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col md:items-center md:text-center">
              <div className="flex md:flex-col items-center md:items-center gap-6 md:gap-0 w-full">
                <div className="bg-[#0A0A0F] p-4 flex flex-col items-center shrink-0">
                  <div className="font-mono text-4xl font-bold text-[#beb086] mb-2">{step.num}</div>
                  <div className="inline-block bg-[#beb086]/10 text-[#beb086] font-mono text-xs px-3 py-1 rounded-none border border-[#beb086]/20">
                    {step.time}
                  </div>
                </div>
                
                <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl shadow-black/30 w-full mt-4 flex-1">
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="https://book.ctme.io/consultation?utm_content=how-it-works"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Book Your Free Consultation <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
