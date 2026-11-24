"use client";

import { useEffect, useState } from "react";

const words = ["cme smb 192.168.1.1 -u $USER -p $PASSWORD -M impersonate", "certipy auth -pfx administrator.pfx -dc-ip 192.168.1.1 -ldap-shell", "noPac.py $DOMAIN/$USER:$PASSWORD -dc-ip 192.168.1.1 --impersonate Administrator", "NT AUTHORITY\\SYSTEM"];
const typingSpeed = 50; // ms par lettre
const erasingSpeed = 10; // ms par lettre lors de l'effacement
const pauseBetweenWords = 2500; // pause avant d'effacer

export default function TypewriterBanner() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullWord = words[currentWordIndex];

      setDisplayedText((prev) => {
        if (!isDeleting) {
          const nextText = fullWord.slice(0, prev.length + 1);
          if (nextText === fullWord) {
            setTimeout(() => setIsDeleting(true), pauseBetweenWords);
          }
          return nextText;
        } else {
          const nextText = fullWord.slice(0, prev.length - 1);
          if (nextText === "") {
            setIsDeleting(false);
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
          }
          return nextText;
        }
      });
    };

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? erasingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex]);

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-muted-primary w-full max-w-7xl h-32 flex flex-col items-center justify-center text-2xl md:text-3xl font-bold relative">
        {/* Texte souligné */}
        <span className="underline decoration-2 font-inter">
          {displayedText}
          <span className="animate-blink text-[#ff0088]">|</span>
        </span>

        {/* Triangle équilatéral plus gros */}
        <div className="mt-3 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[16px] border-l-transparent border-r-transparent border-b-red-600" />
      </div>
    </div>
  );
}
