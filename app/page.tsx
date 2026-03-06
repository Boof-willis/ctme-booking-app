import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { SocialProofBar } from '@/components/sections/SocialProofBar';
import { SocialProofQuotes } from '@/components/sections/SocialProofQuotes';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Testimonials } from '@/components/sections/Testimonials';
import { WhyCTME } from '@/components/sections/WhyCTME';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/layout/Footer';
import { FloatingMobileCTA } from '@/components/layout/FloatingMobileCTA';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProofBar />
        <SocialProofQuotes />
        <ProblemSection />
        <HowItWorks />
        <Testimonials />
        <WhyCTME />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
