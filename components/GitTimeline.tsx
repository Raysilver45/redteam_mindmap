"use client";

import { delay, motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function GitTimeline() {
  const totalDuration = 8.5;
  const quarter = totalDuration * 0.25;
  const pointDelay = quarter - 0.28; // moment où le point pop

  // --- States pour les textes ---
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");

  const typewriter = (text: string, setText: (s: string) => void, speed = 80) => {
    let i = 0;
    const interval = setInterval(() => {
      setText(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  };

  // --- Texte 1: Initial access ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      typewriter("Initial access", setText1, 80);
    }, 100); // très léger delay au début de la timeline
    return () => clearTimeout(timeout);
  }, []);

  // --- Texte 2: Server comprise ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      typewriter("Server compromise", setText2, 80);
    }, (pointDelay + 0.1) * 1000); // Ajout du délai du motion.div (+0.1)
    return () => clearTimeout(timeout);
  }, []);

  // --- Texte 3: Scheduled tasks injection ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      typewriter("Scheduled tasks injection", setText3, 80);
    }, (pointDelay + 2.3) * 1000); // Synchronisé avec le delay Framer (1.8)
    return () => clearTimeout(timeout);
  }, []);

// --- Texte 4: Domain admin ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      typewriter("Domain admin", setText4, 80);
    }, (pointDelay + 3.9) * 1000); // Synchronisé avec le delay Framer (2.8)
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute left-0 top-0 bottom-0 flex items-start ml-20 py-20 pointer-events-none">
      <div className="relative h-full flex items-start">

        {/* --- Texte 1: Initial access --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -30 }}
          transition={{ duration: 0.4 }}
          className="absolute top-[1%] left-15 font-mono text-sm dark:text-white select-none whitespace-nowrap"
        >
          {text1}
          {text1.length < "Initial access".length && <span className="inline-block animate-blink">|</span>}
        </motion.div>

        {/* --- Segment 1 (0 → 25%) --- */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0.25 }}
          transition={{ duration: quarter, ease: "linear" }}
          className="absolute top-0 left-2 w-6 bg-primary rounded-lg origin-top h-full"
        />

        {/* --- Point --- */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ delay: pointDelay, duration: 0.35, ease: "backOut" }}
          className="absolute top-[25%] left-0 w-11 h-11 bg-[#951e1eff] rounded-full translate-x-[-2px] translate-y-[-50%] z-20"
        />

        {/* --- Texte 2: Server compromise --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -30 }}
          transition={{ delay: pointDelay + 0.1, duration: 0.4 }}
          className="absolute top-[24%] left-15 font-mono text-sm dark:text-white select-none whitespace-nowrap"
        >
          {text2}
          {text2.length < "Server compromise".length && <span className="inline-block animate-blink">|</span>}
        </motion.div>

        {/* --- Segment 2 après le point --- */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0.75 }}
          transition={{ delay: pointDelay + 0.15, duration: totalDuration - quarter, ease: "easeOut" }}
          className="absolute left-2 top-[25%] w-6 bg-primary rounded-full origin-top h-full"
        />

        {/* --- Branche courbée --- */}
       <motion.svg
        width="180"
        height="1500"
        viewBox="0 0 180 1500"
        className="absolute -left-7 top-[24.7%] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: pointDelay + 0.15 , ease: "easeOut"}}
      >
        <motion.path
          d="M 70 10 A 70 70 100 0 1 140 80 V 1500"
          stroke="#7A0C0C"
          strokeWidth={15}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 0.6 }}  // <- tracé progressif
          transition={{
            delay: pointDelay + 0.18,
            duration: totalDuration - quarter,   // durée du tracé en secondes (plus rapide ou plus lent selon ton goût)
            ease: "easeOut", // vitesse constante
          }}
        />
      </motion.svg>

      {/* --- Point --- */}
      <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ delay: pointDelay + 2.2, duration: 0.35, ease: "backOut" }}
          className="absolute left-23 top-[40%] left-0 w-11 h-11 bg-[#610808] rounded-full translate-x-[-2px] translate-y-[-50%] z-20"
        />

        {/* --- Texte 3: Scheduled tasks injection --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -30 }}
          transition={{ delay: pointDelay + 2.3, duration: 0.4 }}
          className="absolute top-[41%] left-38 font-mono text-sm dark:text-white select-none whitespace-nowrap"
        >
          {text3}
          {text3.length < "Scheduled tasks injection".length && <span className="inline-block animate-blink">|</span>}
        </motion.div>

        {/* --- Point --- */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ delay: pointDelay + 3.8, duration: 0.35, ease: "backOut" }}
          className="absolute left-23 top-[50%] left-0 w-11 h-11 bg-[#610808] rounded-full translate-x-[-2px] translate-y-[-50%] z-20"
        />

        {/* --- Texte 4: Domain admin --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -30 }}
          transition={{ delay: pointDelay + 3.9, duration: 0.4 }}
          className="absolute top-[51%] left-38 font-mono text-sm dark:text-white select-none whitespace-nowrap"
        >
          {text4}
          {text4.length < "Domain admin".length && <span className="inline-block animate-blink">|</span>}
        </motion.div>

      </div>
    </div>
  );
}
