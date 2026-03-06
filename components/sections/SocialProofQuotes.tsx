import { VideoPlayer } from '@/components/ui/VideoPlayer';

export function SocialProofQuotes() {
  return (
    <section className="bg-[#0A0A0F] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="font-mono text-sm uppercase tracking-widest text-[#beb086] mb-4 block">
            &gt; Hear From Our Clients
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Real Results. Real People.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 p-4 shadow-2xl shadow-black/40">
            <div className="relative aspect-video w-full mb-4">
              <VideoPlayer videoId="6jB1CTnlA-w" title="Jeff M.'s Testimonial" />
            </div>
            <div className="flex items-center justify-between px-2 pb-1">
              <div>
                <span className="text-white text-sm font-bold">Jeff M.</span>
                <span className="text-zinc-600 text-xs font-mono ml-2 uppercase tracking-wider">Verified Client</span>
              </div>
              <span className="text-[#beb086] text-xs tracking-widest">★★★★★</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 shadow-2xl shadow-black/40">
            <div className="relative aspect-video w-full mb-4">
              <VideoPlayer videoId="RyYtCGzMSXE" title="Jake A.'s Testimonial" />
            </div>
            <div className="flex items-center justify-between px-2 pb-1">
              <div>
                <span className="text-white text-sm font-bold">Jake A.</span>
                <span className="text-zinc-600 text-xs font-mono ml-2 uppercase tracking-wider">Verified Client</span>
              </div>
              <span className="text-[#beb086] text-xs tracking-widest">★★★★★</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
