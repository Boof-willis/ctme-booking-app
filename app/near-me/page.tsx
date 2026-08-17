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
 * Landing page for the "Crypto Accountant Near Me" ad group.
 *
 * Same sections as the master page. The only deltas are the hero, which leads with
 * remote / working across the US so the local-office objection is answered before the visitor
 * scrolls, and the FAQ, which hoists "Are you local to me?" to the first question.
 *
 * noindex: paid-traffic destination, kept out of the index so it cannot compete with
 * cryptotaxmadeeasy.com for organic.
 */
export const metadata: Metadata = {
  title: 'Crypto Accountant Near You | We Work Remotely | Crypto Tax Made Easy',
  description:
    'Crypto-fluent accountants are scarce locally. We work remotely with clients across the US, reconciling every transaction by hand. 802 client reports reviewed. Free 15-minute call.',
  robots: { index: false, follow: false },
};

export default function NearMe() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero variant="near-me" />
        <SocialProofBar />
        <SocialProofQuotes />
        <ProblemSection />
        <ImpactStudy />
        <HowItWorks />
        <Testimonials />
        <WhyCTME />
        <FAQ variant="near-me" />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingMobileCTA />
    </div>
  );
}
