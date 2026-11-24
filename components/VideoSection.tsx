"use client";

import VideoCard from "@/components/ui/videocard";

export default function VideoSection() {
  return (
    /* 1. La section prend toute la largeur et gère le padding global mobile (px-4) */
    <section className="w-full overflow-hidden py-10 px-4">
      
      <div className="max-w-7xl mx-auto relative rounded-[1.5rem] bg-hero-left overflow-hidden p-8 md:p-12
        before:absolute before:inset-0 before:rounded-[1.5rem] before:border-[2px] before:border-primary
        before:[mask-image:linear-gradient(to_bottom,black_20%,transparent_95%)] before:pointer-events-none">
        
        <div className="relative z-10">
          {/* Titre de la section style Exegol */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold font-title-2 mb-4">Tools</h2>
            <div className="h-1 w-12 bg-primary mx-auto lg:mx-0" />
          </div>

          {/* Grille des vidéos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <VideoCard 
              title="Interactive mindmaps"
              description="Navigate through comprehensive mindmaps and gain detailed insights into exploiting each path."
              videoSrc="/demo1.webm" 
            />
            <VideoCard 
              title="Training labs"
              description="Set up vulnerable virtual environments to practice and master various offensive techniques."
              videoSrc="/demo1.webm" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}