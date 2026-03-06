import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-24 md:pb-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-6 opacity-80">
              <Image
                src="/ctme-logo.png"
                alt="Crypto Tax Made Easy"
                width={1920}
                height={1080}
                className="w-[140px] h-auto object-contain"
              />
            </div>
            <p className="text-zinc-500 max-w-xs mb-6 leading-relaxed">
              Specialist crypto tax reconciliation for DeFi, NFTs, and complex on-chain activity.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-3 text-zinc-500">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#results" className="hover:text-white transition-colors">Results</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-zinc-500">
              <li><a href="https://cryptotaxmadeeasy.com/privacy-policy/" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="https://cryptotaxmadeeasy.com/terms-of-service/" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
            <div className="mt-6">
              <a
                href="https://book.ctme.io/consultation?utm_content=footer"
                className="inline-flex items-center justify-center gap-2 rounded-none border border-zinc-700 hover:border-[#beb086] hover:text-[#beb086] bg-transparent px-5 py-2.5 text-sm font-medium text-white transition-colors"
              >
                Book Consultation <span>→</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest text-center md:text-left">
            USA · Australia · Canada · UK · New Zealand
          </div>
          <div className="text-zinc-600 text-xs text-center md:text-right max-w-2xl">
            Crypto Tax Made Easy provides crypto tax reconciliation and reporting services. Results vary based on individual tax situations. This is not financial, legal, or tax advice. Consult a qualified tax professional for advice specific to your situation.<br/><br/>
            © {new Date().getFullYear()} Crypto Tax Made Easy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
