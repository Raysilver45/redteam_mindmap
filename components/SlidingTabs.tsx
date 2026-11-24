"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface TabProps {
  tabs: string[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function SlidingTabs({ tabs, activeTab, onChange }: TabProps) {
  return (
    /* - bg-primary : Ton Rouge Terre sombre pour le conteneur.
       - border-primary/20 : Une bordure légère pour définir la forme.
    */
    <div className="flex p-1 bg-primary border border-primary/20 rounded-full backdrop-blur-md  mt-4 relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`relative px-6 py-2 text-[10px] font-black tracking-widest uppercase transition-colors duration-500 min-w-[100px] ${
              /* - isActive : Texte sombre (foreground) sur la pilule Crème.
                 - !isActive : Texte Crème (background) atténué sur le fond Rouge Terre.
              */
              isActive ? 'text-foreground' : 'text-background/40 hover:text-background/80'
            }`}
          >
            {/* EFFET DE SLIDE (Pillule) */}
            {isActive && (
              <motion.div
                layoutId="active-pill"
                /* - bg-background : La pilule utilise ton Crème clair.
                   - shadow : Un léger glow Crème pour la profondeur.
                */
                className="absolute inset-0 bg-foreground/85 rounded-full [0_0_15px_rgba(243,242,232,0.3)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                style={{ zIndex: 0 }}
              />
            )}
            <span className="relative z-10 text-background">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}