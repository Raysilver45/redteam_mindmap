"use client";

import React, { useEffect, useState } from "react";
import { TocItem } from "@/lib/tableofcontents";

type TocProps = {
  items: TocItem[];
};

export const TableOfContents: React.FC<TocProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
  const handleScroll = () => {
    let current = "";
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= 120) { // 120px = espace pour header fixe, ajuste si nécessaire
        current = item.id;
      }
    }
    setActiveId(current);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // déclenche au montage

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [items]);

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const yOffset = -100; // ajustement pour header fixe si besoin
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <aside className="hidden lg:block fixed right-20 top-32 w-64 space-y-4">
      <h2 className="text-foreground dark:text-white font-semibold uppercase tracking-wide">
        Table of Contents
      </h2>

      <div className="text-sm space-y-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(item.id, e)}
              className={`block pl-${(item.level - 1) * 4} ${
                isActive
                  ? "text-orange-500 font-bold"
                  : "text-muted-foreground hover:text-orange-500"
              } transition-colors duration-200`}
            >
              {item.text}
            </a>
          );
        })}
      </div>
    </aside>
  );
};
