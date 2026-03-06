'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function NavbarClient() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-zinc-800 py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <Image
            src="/ctme-logo.png"
            alt="Crypto Tax Made Easy"
            width={1920}
            height={1080}
            className="w-[100px] sm:w-[120px] h-auto object-contain"
            priority
          />
        </a>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#results" className="hover:text-white transition-colors">Results</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        
        <a
          href="https://book.ctme.io/consultation?utm_content=navbar"
          className="rounded-none bg-[#beb086] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#a89b74] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#beb086] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]"
        >
          Book Free Consultation
        </a>
      </div>
    </header>
  );
}
