export function WhyCTME() {
  const coverage = [
    "DeFi", "NFTs", "Solana", "Bitcoin Ordinals", "BRC-20", "Hyperliquid",
    "On-Chain Perps", "Multi-Chain", "Bridges", "Airdrops", "Mining",
    "Staking", "Yield Farming", "Liquidity Pools"
  ];

  return (
    <section className="bg-[#0A0A0F] py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            Why CTME
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Crypto-Native. Not Crypto-Adjacent.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Your CPA */}
          <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col h-full shadow-2xl shadow-black/40">
            <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">Your CPA</h3>
            <ul className="space-y-6 flex-1 text-zinc-500">
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Pricing</div>
                <div>$300-500/hr</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Crypto Expertise</div>
                <div>Minimal to none</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">DeFi/NFT Handling</div>
                <div>"How much did you put in?"</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Accuracy</div>
                <div>Depends on their knowledge</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Your Time Investment</div>
                <div>Hours of explanation</div>
              </li>
              <li className="pt-4 border-t border-zinc-800">
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-zinc-400">Result</div>
                <div className="font-bold text-zinc-300">Risky return, high cost</div>
              </li>
            </ul>
          </div>

          {/* Tax Software */}
          <div className="bg-zinc-950 border border-zinc-800 p-8 flex flex-col h-full shadow-2xl shadow-black/40">
            <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">Tax Software</h3>
            <ul className="space-y-6 flex-1 text-zinc-500">
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Pricing</div>
                <div>$49-299/yr</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Crypto Expertise</div>
                <div>Automated only</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">DeFi/NFT Handling</div>
                <div>Breaks on complex activity</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Accuracy</div>
                <div>90% overreport gains</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1">Your Time Investment</div>
                <div>Hours of fixing errors</div>
              </li>
              <li className="pt-4 border-t border-zinc-800">
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-zinc-400">Result</div>
                <div className="font-bold text-amber-500">Inflated tax bill</div>
              </li>
            </ul>
          </div>

          {/* CTME */}
          <div className="bg-zinc-900 border-2 border-[#beb086] p-8 flex flex-col h-full shadow-[0_0_30px_rgba(190,176,134,0.1)] relative">
            <div className="absolute top-0 right-0 bg-[#beb086] text-black font-mono text-xs font-bold px-3 py-1 uppercase tracking-wider">
              Our Service
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-zinc-800">CTME</h3>
            <ul className="space-y-6 flex-1 text-white">
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-[#beb086]">Pricing</div>
                <div className="font-medium">Flat rate per engagement</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-[#beb086]">Crypto Expertise</div>
                <div className="font-medium">Crypto-native team</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-[#beb086]">DeFi/NFT Handling</div>
                <div className="font-medium">Manual review of every transaction</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-[#beb086]">Accuracy</div>
                <div className="font-medium">Audit-ready, manually verified</div>
              </li>
              <li>
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-[#beb086]">Your Time Investment</div>
                <div className="font-medium">20 minutes</div>
              </li>
              <li className="pt-4 border-t border-zinc-800">
                <div className="font-mono text-xs uppercase tracking-wider mb-1 text-[#beb086]">Result</div>
                <div className="font-bold text-white">Accurate report, maximum savings</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-8">
            Every Type of Crypto Activity. Handled.
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {coverage.map((item, i) => (
              <span key={i} className="bg-zinc-900 border border-zinc-800 px-4 py-2 font-mono text-sm text-zinc-400 hover:border-[#beb086]/50 hover:text-white transition-colors cursor-default">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center pb-16 border-b border-zinc-900 mb-16">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 opacity-40 hover:opacity-100 transition-opacity duration-300 font-mono text-sm tracking-wider uppercase text-white mb-6">
            <span>Binance</span>
            <span className="hidden sm:inline">·</span>
            <span>CoinTelegraph</span>
            <span className="hidden sm:inline">·</span>
            <span>CryptoNews</span>
            <span className="hidden sm:inline">·</span>
            <span>NGMI Podcast</span>
          </div>
          <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase">
            USA · Australia · Canada · UK · New Zealand
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://book.ctme.io/consultation?utm_content=why-ctme"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Book Your Free Tax Review <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
