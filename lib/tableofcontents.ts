// lib/tableofcontents.ts
export type TocItem = {
  text: string;
  id: string;
  level: number;
};

/**
 * Génère un TOC à partir d'une string MDX (server-side)
 */
export const generateToc = (mdxContent: string): TocItem[] => {
  const regex = /^(#{1,6})\s+(.+)$/gm;
  const matches = [...mdxContent.matchAll(regex)];
  return matches.map((match) => {
    const level = match[1].length; // # -> h1, ## -> h2, etc.
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return { text, id, level };
  });
};
