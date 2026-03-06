'use client';

import { useState } from 'react';
import { FAQAccordion } from './FAQAccordion';

const FAQS = [
  {
    question: "How much does this cost?",
    answer: "Our pricing is flat-rate based on your transaction volume. No hourly billing, no surprise invoices. We review your situation, give you one clear price upfront, and that's what you pay. Most of our clients save more in tax than our fee. Book a free consultation and we'll tell you the exact cost before you commit to anything."
  },
  {
    question: "Do you file my tax return?",
    answer: "No. We deliver an audit-ready crypto tax report that your CPA or tax preparer uses to file your return. If you self-file using TurboTax or similar software, you can import our report directly. We also support your CPA at no extra charge if they have questions about the crypto-specific details."
  },
  {
    question: "What if I don't have a CPA or accountant?",
    answer: "That's fine. Our report is designed to work with any filing method. If you use TurboTax, H&R Block, or any other self-filing tool, you can import the report directly. We'll walk you through the process."
  },
  {
    question: "What if I have multiple years of unfiled crypto taxes?",
    answer: "We handle multi-year cleanups regularly. Many clients come to us with 2-4 years of backlogged crypto activity. We'll build a historically accurate picture from scratch and get each year squared away. The sooner you start, the less exposure you have."
  },
  {
    question: "Is my data secure?",
    answer: "Your security is a priority. You grant us \"accountant level\" access to your crypto tax software, which means we can see your transaction data and make edits but nothing else. All communication happens inside enterprise-grade practice management software. We never discuss specific transactions over regular email. Many of our security-conscious clients even set up their software with a burner email."
  },
  {
    question: "What countries do you support?",
    answer: "We currently serve crypto investors and traders in the United States, Australia, Canada, the United Kingdom, and New Zealand. Our team is experienced with the tax rules in each of these jurisdictions."
  },
  {
    question: "How long does the process take?",
    answer: "It depends on the complexity of your situation, but the typical timeline is 1-3 weeks from when you grant us access. We always deliver well before tax deadlines when you start early. During peak season (January through April for US clients), we recommend getting started as early as possible to secure your spot."
  },
  {
    question: "What types of crypto activity do you cover?",
    answer: "Everything. DeFi (yield farming, liquidity pools, staking, lending), NFTs and NFTfi, on-chain trading and memecoins, Solana ecosystem, Bitcoin Ordinals and BRC-20, Hyperliquid perps, on-chain perps, multi-chain activity, bridges, airdrops, forks, mining, and crypto business bookkeeping. If it happened on-chain, we've seen it before."
  },
  {
    question: "How does your pricing compare to other services?",
    answer: "Traditional CPA firms charge $300-500 per hour for crypto work, and because they're not specialists, it takes them longer. That means a higher bill for less accurate work. Done-for-you plans from other crypto tax firms start at $2,500-3,500 for basic cases. We use flat-rate pricing based on transaction volume, which makes us commonly 5x cheaper than traditional firms for the same depth of work."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-zinc-950 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        <div className="mb-12 border-t border-zinc-800">
          {FAQS.map((faq, i) => (
            <FAQAccordion
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="text-center font-mono text-xs text-zinc-600 mb-12 uppercase tracking-wider">
          Results vary based on individual tax situations. Past savings do not guarantee future results.
        </div>

        <div className="text-center">
          <a
            href="https://book.ctme.io/consultation?utm_content=faq"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Still Have Questions? Book a Free Consultation <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
