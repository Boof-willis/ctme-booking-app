'use client';

import { useState } from 'react';
import { FAQAccordion } from './FAQAccordion';
import { ConsultationLink } from '@/components/ui/ConsultationLink';

type FaqItem = { id?: string; question: string; answer: string };

const FAQS: FaqItem[] = [
  {
    id: "local",
    question: "Are you local to me?",
    answer: "We work remotely with clients across the US (and Australia, Canada, the UK and New Zealand), so no, and that is usually the point. Crypto-fluent accountants are scarce in most cities, which is why people search for one nearby and come up empty. Working remotely is what lets us staff actual specialists instead of whoever is closest to you. Everything happens over a call and inside secure practice management software, so there is nothing you would have gained by driving to an office."
  },
  {
    id: "cost",
    question: "How much does this cost?",
    answer: "Our pricing is flat-rate based on your transaction volume. No hourly billing, no surprise invoices. We review your situation, give you one clear price upfront, and that's what you pay. Most of our clients save more in tax than our fee. Book a free consultation and we'll tell you the exact cost before you commit to anything."
  },
  {
    id: "minimum",
    question: "What does it cost to get started?",
    answer: "Our done-for-you service has a $1,500 minimum engagement, and we'd rather you know that now than at the end of a call. That $1,500 buys four hours of high-level review, and it is not a deposit you lose. If you decide afterwards that you want the full line-by-line reconciliation, the $1,500 rolls into the comprehensive cost. If your situation is smaller and simpler than that, we'll tell you on the call and point you at our course instead."
  },
  {
    id: "already-filed",
    question: "I already filed. Is it too late to check?",
    answer: "No, and this is more common than people expect. Of the 802 client reports we reviewed, 56.4% had overstated gains and 43.6% had underreported them, so a return that has already gone in is worth a second look in either direction. You can generally amend a prior year with Form 1040-X within three years of filing or two years of paying, whichever is later. Even outside that window, the reconciliation still matters, because cost basis carries forward and one wrong call in 2021 makes every year after it wrong too."
  },
  {
    question: "Do you file my tax return?",
    answer: "Filing isn't the core of what we do. We specialize in reconciliation: hand-checking every transaction and turning it into an audit-ready report. That report drops straight into TurboTax or your own CPA's workflow, and we support your CPA at no extra charge if they have questions about the crypto-specific details. If you'd rather not deal with filing yourself, we can also connect eligible US clients with a licensed CPA partner, Michael Bergloff, for tax return filing, IRS notice response and audit defense where scoped."
  },
  {
    question: "What if I don't have a CPA or accountant?",
    answer: "That's fine. Our report is designed to work with any filing method. If you use TurboTax, H&R Block, or any other self-filing tool, you can import the report directly, and we'll walk you through the process. If you'd rather have someone file it for you, we can introduce eligible clients to a licensed CPA partner instead."
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
    answer: "It depends on how complex your situation is: how many wallets and chains are involved, how many tax years, and how much of the history has to be rebuilt from scratch. We scope the timeline with you on the call, before you commit to anything. During peak season (January through April for US clients), we recommend getting started as early as possible to secure your spot."
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

export function FAQ({ variant = 'master' }: { variant?: 'master' | 'near-me' }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // The near-me group's searchers expect a local office, so that objection is
  // answered first. On the master page the pricing question leads instead.
  const faqs =
    variant === 'near-me'
      ? FAQS
      : [...FAQS.filter((f) => f.id !== 'local'), ...FAQS.filter((f) => f.id === 'local')];

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
          {faqs.map((faq, i) => (
            <FAQAccordion
              key={faq.question}
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
          <ConsultationLink
            section="faq"
            className="inline-flex items-center justify-center gap-2 rounded-none bg-[#beb086] px-8 py-4 text-base font-bold text-black hover:bg-[#a89b74] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(190,176,134,0.15)]"
          >
            Still Have Questions? Book a Free Consultation <span>→</span>
          </ConsultationLink>
        </div>
      </div>
    </section>
  );
}
