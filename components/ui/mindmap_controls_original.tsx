"use client";

import React from 'react';
import { useReactFlow, Panel } from 'reactflow';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function MindmapControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const buttonClass = `
    p-2.5 bg-slate-900/90 border border-slate-800 
    text-slate-400 hover:text-blue-400 
    hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] 
    transition-all duration-200 rounded-lg backdrop-blur-sm
  `;

  return (
    <Panel position="bottom-left" className="flex gap-2 mb-4 ml-4">
      <div className="flex bg-slate-950/50 p-1 rounded-xl border border-slate-800/50 backdrop-blur-md gap-2">
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