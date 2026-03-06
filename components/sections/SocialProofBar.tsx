'use client';

import { useRef, useEffect, useState } from 'react';

export function SocialProofBar() {
  const items = [
    "$21.8M+ Tax Savings",
    "200+ Clients Served",
    "4.96★ Reviews",
    "5+ Years Experience",
    "USA · AU · CA · UK · NZ"
  ];

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
    }
  }, []);

  return (
    <section className="border-y border-zinc-800 bg-[#0A0A0F] py-5 overflow-hidden select-none">
      <div
        className="flex w-max"
        style={{
          animation: contentWidth ? `marquee-scroll ${contentWidth / 40}s linear infinite` : undefined,
        }}
      >
        {[0, 1, 2].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? contentRef : undefined}
            aria-hidden={copy > 0}
            className="flex shrink-0 items-center gap-8 md:gap-12 font-mono text-xs md:text-sm uppercase tracking-widest text-zinc-500 pr-8 md:pr-12"
          >
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-8 md:gap-12">
                <span className="whitespace-nowrap">{item}</span>
                <span className="opacity-50">·</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
