'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <div 
      className="absolute inset-0 w-full h-full cursor-pointer group bg-zinc-950 overflow-hidden"
      onClick={() => setIsPlaying(true)}
    >
      <img 
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-sm border border-white/10 text-white px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all duration-500 group-hover:bg-[#beb086] group-hover:text-black group-hover:border-[#beb086] group-hover:scale-105">
          [ Click to Play ]
        </div>
      </div>
    </div>
  );
}
