"use client";

import React from 'react';
import { useReactFlow, Panel } from 'reactflow';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function MindmapControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Utilisation des variables du thème oklch
  const buttonClass = `
    p-2.5 
    bg-card/90 border border-border 
    text-muted-foreground 
    hover:text-primary hover:border-primary/50 
    hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] 
    transition-all duration-200 rounded-[0.3rem] backdrop-blur-sm
  `;

  return (
    <Panel position="bottom-left" className="flex gap-2 mb-4 ml-4">
      {/* Conteneur principal utilisant le style "glassmorphism" de ton thème */}
      <div className="flex bg-background/50 p-1 rounded-xl border border-border/50 backdrop-blur-md gap-2">
        
        <button 
          onClick={() => fitView({ duration: 600 })} 
          className={buttonClass}
          title="Reset View"
        >
          <Maximize size={18} />
        </button>

        <button 
          onClick={() => zoomOut({ duration: 400 })} 
          className={buttonClass}
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        
        <button 
          onClick={() => zoomIn({ duration: 400 })} 
          className={buttonClass}
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>

      </div>
    </Panel>
  );
}