import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { SocialProofBar } from '@/components/sections/SocialProofBar';
import { SocialProofQuotes } from '@/components/sections/SocialProofQuotes';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { ImpactStudy } from '@/components/sections/ImpactStudy';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Testimonials } from '@/components/sections/Testimonials';
import { WhyCTME } from '@/components/sections/WhyCTME';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';
import { FloatingMobileCTA } from '@/components/layout/FloatingMobileCTA';

/**
 * Page-scoped so the paid-search title and description lead with the query wording
 * ("crypto tax accountant") without changing the title on the booking flow, which
 * keeps the layout default.
 *
 * noindex: same reasoning as /near-me. This is a paid-traffic destination, and now
 * that the H1 and title target "crypto tax accountant", leaving it indexable would
 * put it in competition with cryptotaxmadeeasy.com for that exact term. AdsBot
 * ignores the noindex meta, so Quality Score and landing page experience are
 * unaffected.
 */
export const metadata: Metadata = {
  title: 'Crypto Tax Accountants | Remote, US-Wide | Crypto Tax Made Easy',
  description:
    'Crypto tax accountants who reconcile every transaction by hand. Remote across the USA, Australia, Canada, New Zealand, and the UK. Free 15-minute call.',
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProofBar />
        <SocialProofQuotes />
        <ProblemSection />
        <ImpactStudy />
        <HowItWorks />
        <Testimonials />
        <WhyCTME />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingMobileCTA />
    </div>
  );
}
