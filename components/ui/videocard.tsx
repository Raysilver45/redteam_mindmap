"use client";

import { useRef } from "react";
import * as motion from "motion/react-client";

interface VideoCardProps {
  title: string;
  description: string;
  videoSrc: string;
}

export default function VideoCard({ title, description, videoSrc }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <motion.div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col space-y-6"
    >
      {/* 1. CONTENEUR VIDÉO AGRANDI (w-full et aspect-video) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl transition-all duration-500 group-hover:border-primary/40">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          className="h-full w-full object-cover group-hover:opacity-100 transition-opacity duration-300"
        />
        
        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
           <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-1" />
           </div>
        </div>
      </div>

      {/* 2. TEXTE DÉCALÉ VERS LA DROITE (via pl-6) */}
      <div className="space-y-2 pl-6 md:pl-2">
        <h3 className="text-2xl font-bold font-title-2 tracking-tight">{title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed max-w-md">
          {description}
        </p>
      </div>
    </motion.div>
  );
}